use std::{sync::Arc, time::Instant};

use actix_web::{dev::ServiceRequest, http::header};
use actix_web_ratelimit::{
    config::RateLimitConfig,
    store::{MemoryStore, RateLimitStore},
    RateLimit,
};

use crate::{config::RateLimitSettings, dto::error::ErrorCode, error::ApiError};

pub type SharedStore = Arc<dyn RateLimitStore>;

/// The upstream MemoryStore currently checks `len() > max_requests`, allowing
/// an extra request. This wrapper enforces the configured limit exactly.
/// It reuses the dependency's thread-safe DashMap so all workers share state.
#[derive(Default)]
struct ExactMemoryStore(MemoryStore);

impl RateLimitStore for ExactMemoryStore {
    fn is_limited(&self, key: &str, config: &RateLimitConfig) -> bool {
        let now = Instant::now();
        let mut entry = self.0.store.entry(key.to_owned()).or_default();
        let timestamps = entry.value_mut();
        timestamps.retain(|&timestamp| now.duration_since(timestamp) <= config.window_secs);
        if timestamps.len() >= config.max_requests {
            return true;
        }
        timestamps.push(now);
        false
    }
}

pub fn new_store() -> SharedStore {
    Arc::new(ExactMemoryStore::default())
}

pub fn rate_limit(settings: &RateLimitSettings, store: SharedStore) -> RateLimit<SharedStore> {
    let config = RateLimitConfig::default()
        .max_requests(settings.requests_per_window)
        .window_secs(settings.window_seconds)
        .id(client_ip)
        .exceeded(|_client_id, config, _request| {
            actix_web::HttpResponse::TooManyRequests()
                .insert_header((header::RETRY_AFTER, config.window_secs.as_secs().to_string()))
                .json(ApiError::new(ErrorCode::RateLimited).to_response())
        });

    RateLimit::new(config, store)
}

fn client_ip(request: &ServiceRequest) -> String {
    // Forwarded headers are untrusted unless the proxy trust boundary is configured.
    request
        .peer_addr()
        .map(|address| address.ip().to_string())
        .unwrap_or_else(|| "unknown-peer".to_owned())
}
