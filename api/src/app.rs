use actix_web::{HttpResponse, ResponseError, error::JsonPayloadError, web};

use crate::{
    config::RateLimitSettings,
    dto::error::ErrorCode,
    error::ApiError,
    middleware::rate_limit::{SharedStore, rate_limit},
    routes::health::health_routes,
};

pub const MAX_JSON_BYTES: usize = 64 * 1024;

pub fn configure_routes(
    cfg: &mut web::ServiceConfig,
    limiter_store: SharedStore,
    limits: &RateLimitSettings,
) {
    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/v1")
                    .wrap(rate_limit(limits, limiter_store))
                    .default_service(web::to(not_found)),
            )
            .service(health_routes()),
    );
}

pub fn json_config() -> web::JsonConfig {
    web::JsonConfig::default()
        .limit(MAX_JSON_BYTES)
        .error_handler(|err, _request| {
            let code = match err {
                JsonPayloadError::Overflow { .. }
                | JsonPayloadError::OverflowKnownLength { .. } => ErrorCode::PayloadTooLarge,
                _ => ErrorCode::InvalidRequest,
            };
            ApiError::new(code).into()
        })
}

pub fn query_config() -> web::QueryConfig {
    web::QueryConfig::default()
        .error_handler(|_err, _request| ApiError::new(ErrorCode::InvalidRequest).into())
}

pub fn path_config() -> web::PathConfig {
    web::PathConfig::default()
        .error_handler(|_err, _request| ApiError::new(ErrorCode::InvalidRequest).into())
}

pub async fn not_found() -> HttpResponse {
    ApiError::new(ErrorCode::NotFound).error_response()
}
