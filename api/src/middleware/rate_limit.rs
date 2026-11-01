use std::sync::Arc;

use actix_web::{dev::ServiceRequest, http::header};
use actix_web_ratelimit::{
    config::RateLimitConfig,
    store::MemoryStore,
    RateLimit,
};

use crate::{
    config::RateLimitSettings,
    dto::error::ErrorCode,
    error::ApiError,
};

pub type SharedStore = Arc<MemoryStore>;

pub fn new_store() -> SharedStore {
    Arc::new(MemoryStore::new())
}

pub fn rate_limit(settings: &RateLimitSettings, store: SharedStore) -> RateLimit<SharedStore> {
    let config = RateLimitConfig::default()
        .max_requests(settings.requests_per_window)
        .window_secs(settings.window_seconds)
        .id(client_ip)
        .exceeded(|_client_id, config, _request| {
            // Fixed Retry-After is conservative for a sliding-window limiter.
            // Keep response details independent of IP and request data.
            actix_web::HttpResponse::TooManyRequests()
                .insert_header((header::RETRY_AFTER, config.window_secs.as_secs().to_string()))
                .json(ApiError::new(ErrorCode::RateLimited).to_response())
        });

    RateLimit::new(config, store)
}

fn client_ip(request: &ServiceRequest) -> String {
    // Deliberately ignore Forwarded / X-Forwarded-For / realip_remote_addr:
    // those values are untrusted unless a proxy trust boundary is configured.
    request
        .peer_addr()
        .map(|address| address.ip().to_string())
        .unwrap_or_else(|| "unknown-peer".to_owned())
}
