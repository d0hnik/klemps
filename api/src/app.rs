use actix_web::{error::JsonPayloadError, web, HttpResponse, ResponseError};

use crate::{dto::error::ErrorCode, error::ApiError, routes::health::health_routes};

/// The same route registration is used by production and request tests.
pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            // Infrastructure endpoints are unversioned and don't require auth/DB.
            .service(health_routes())
            .service(web::scope("/v1")),
    );
}

pub fn json_config() -> web::JsonConfig {
    web::JsonConfig::default().limit(16 * 1024).error_handler(|err, _request| {
        let code = match err {
            JsonPayloadError::Overflow { .. } | JsonPayloadError::OverflowKnownLength { .. } => {
                ErrorCode::PayloadTooLarge
            }
            _ => ErrorCode::InvalidRequest,
        };
        // Do not expose a raw serde/deserialization error or request data.
        ApiError::new(code).into()
    })
}

pub fn query_config() -> web::QueryConfig {
    web::QueryConfig::default().error_handler(|_err, _request| {
        ApiError::new(ErrorCode::InvalidRequest).into()
    })
}

pub fn path_config() -> web::PathConfig {
    web::PathConfig::default().error_handler(|_err, _request| {
        ApiError::new(ErrorCode::InvalidRequest).into()
    })
}

pub async fn not_found() -> HttpResponse {
    ApiError::new(ErrorCode::NotFound).error_response()
}
