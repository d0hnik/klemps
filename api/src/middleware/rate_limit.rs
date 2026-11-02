use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    time::Instant,
};

use actix_web::{dev::ServiceRequest, http::header};
use actix_web_ratelimit::{RateLimit, config::RateLimitConfig, store::RateLimitStore};

use crate::{config::RateLimitSettings, dto::error::ErrorCode, error::ApiError};

pub type SharedStore = Arc<dyn RateLimitStore>;

const MAX_CLIENTS: usize = 10_000;

#[derive(Default)]
struct MemoryStore {
    state: Mutex<StoreState>,
}

#[derive(Default)]
struct StoreState {
    clients: HashMap<String, Vec<Instant>>,
    last_cleanup: Option<Instant>,
}

impl MemoryStore {
    fn is_limited_at(&self, key: &str, config: &RateLimitConfig, now: Instant) -> bool {
        let Ok(mut state) = self.state.lock() else {
            return true;
        };

        // Sweep inactive clients once per window, instead of scanning on every request.
        if state
            .last_cleanup
            .is_none_or(|last| now.saturating_duration_since(last) >= config.window_secs)
        {
            state.clients.retain(|_, timestamps| {
                timestamps
                    .iter()
                    .any(|timestamp| now.saturating_duration_since(*timestamp) < config.window_secs)
            });
            state.last_cleanup = Some(now);
        }

        // Reject new clients at capacity; evicting active ones would reset their limits.
        if state.clients.len() >= MAX_CLIENTS && !state.clients.contains_key(key) {
            return true;
        }

        let timestamps = state.clients.entry(key.to_owned()).or_default();
        timestamps
            .retain(|timestamp| now.saturating_duration_since(*timestamp) < config.window_secs);
        if timestamps.len() >= config.max_requests {
            return true;
        }
        timestamps.push(now);
        false
    }
}

impl RateLimitStore for MemoryStore {
    fn is_limited(&self, key: &str, config: &RateLimitConfig) -> bool {
        self.is_limited_at(key, config, Instant::now())
    }
}

pub fn new_store() -> SharedStore {
    Arc::new(MemoryStore::default())
}

pub fn rate_limit(settings: &RateLimitSettings, store: SharedStore) -> RateLimit<SharedStore> {
    let config = RateLimitConfig::default()
        .max_requests(settings.requests_per_window)
        .window_secs(settings.window_seconds)
        .id(client_ip)
        .exceeded(|_client_id, config, _request| {
            actix_web::HttpResponse::TooManyRequests()
                .insert_header((
                    header::RETRY_AFTER,
                    config.window_secs.as_secs().to_string(),
                ))
                .json(ApiError::new(ErrorCode::RateLimited).to_response())
        });

    RateLimit::new(config, store)
}

fn client_ip(request: &ServiceRequest) -> String {
    request
        .peer_addr()
        .map(|address| address.ip().to_string())
        .unwrap_or_else(|| "unknown-peer".to_owned())
}

#[cfg(test)]
mod tests {
    use std::{sync::Barrier, thread, time::Duration};

    use super::*;

    #[test]
    fn requests_are_allowed_again_when_the_window_expires() {
        let store = MemoryStore::default();
        let config = RateLimitConfig::default().max_requests(2).window_secs(60);
        let now = Instant::now();

        assert!(!store.is_limited_at("player", &config, now));
        assert!(!store.is_limited_at("player", &config, now));
        assert!(store.is_limited_at("player", &config, now));
        assert!(!store.is_limited_at("player", &config, now + Duration::from_secs(60)));
    }

    #[test]
    fn cleanup_removes_inactive_clients_without_resetting_active_limits() {
        let store = MemoryStore::default();
        let config = RateLimitConfig::default().max_requests(1).window_secs(60);
        let now = Instant::now();

        assert!(!store.is_limited_at("inactive", &config, now));
        assert!(!store.is_limited_at("active", &config, now + Duration::from_secs(59)));
        assert!(!store.is_limited_at("new", &config, now + Duration::from_secs(60)));
        assert!(store.is_limited_at("active", &config, now + Duration::from_secs(60)));

        let state = store.state.lock().unwrap();
        assert!(!state.clients.contains_key("inactive"));
        assert_eq!(state.clients.len(), 2);
    }

    #[test]
    fn capacity_rejects_new_clients_until_expired_entries_are_removed() {
        let store = MemoryStore::default();
        let config = RateLimitConfig::default().max_requests(2).window_secs(60);
        let now = Instant::now();

        for index in 0..MAX_CLIENTS {
            assert!(!store.is_limited_at(&index.to_string(), &config, now));
        }
        assert!(store.is_limited_at("new", &config, now));
        assert!(!store.is_limited_at("0", &config, now));
        assert!(store.is_limited_at("0", &config, now));
        assert_eq!(store.state.lock().unwrap().clients.len(), MAX_CLIENTS);

        assert!(!store.is_limited_at("new", &config, now + Duration::from_secs(60)));
        assert_eq!(store.state.lock().unwrap().clients.len(), 1);
    }

    #[test]
    fn concurrent_requests_cannot_exceed_the_limit() {
        let store = Arc::new(MemoryStore::default());
        let barrier = Arc::new(Barrier::new(16));
        let threads: Vec<_> = (0..16)
            .map(|_| {
                let store = store.clone();
                let barrier = barrier.clone();
                thread::spawn(move || {
                    let config = RateLimitConfig::default().max_requests(4).window_secs(60);
                    barrier.wait();
                    !store.is_limited("player", &config)
                })
            })
            .collect();
        let allowed = threads
            .into_iter()
            .map(|thread| usize::from(thread.join().unwrap()))
            .sum::<usize>();

        assert_eq!(allowed, 4);
    }
}
