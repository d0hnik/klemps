use std::{io, net::TcpListener};

use actix_web::{
    App, HttpResponse, HttpServer, ResponseError,
    dev::Server,
    error::JsonPayloadError,
    web::{Data, JsonConfig, PathConfig, QueryConfig, ServiceConfig, scope, to},
};

use crate::{
    config::{Config, RateLimitSettings},
    dto::error::ErrorCode,
    error::ApiError,
    middleware::{
        cors::cors,
        errors::errors,
        logger,
        rate_limit::{SharedStore, new_store, rate_limit},
    },
    routes::health::health_routes,
    state::Services,
};

pub const MAX_JSON_BYTES: usize = 64 * 1024;

pub fn create_server(listener: TcpListener, config: Config) -> io::Result<Server> {
    let services = Data::new(Services::new());
    let limiter_store = new_store();

    Ok(HttpServer::new(move || {
        App::new()
            .app_data(services.clone())
            .app_data(json_config())
            .app_data(query_config())
            .app_data(path_config())
            .wrap(cors(&config.cors_allowed_origins))
            .wrap(errors())
            .wrap(logger())
            .configure(|cfg| configure_routes(cfg, limiter_store.clone(), &config.rate_limit))
            .default_service(to(not_found))
    })
    .listen(listener)?
    .run())
}

pub fn configure_routes(
    cfg: &mut ServiceConfig,
    limiter_store: SharedStore,
    limits: &RateLimitSettings,
) {
    cfg.service(
        scope("/api")
            .service(
                scope("/v1")
                    .wrap(rate_limit(limits, limiter_store))
                    .default_service(to(not_found)),
            )
            .service(health_routes()),
    );
}

pub fn json_config() -> JsonConfig {
    JsonConfig::default()
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

pub fn query_config() -> QueryConfig {
    QueryConfig::default()
        .error_handler(|_err, _request| ApiError::new(ErrorCode::InvalidRequest).into())
}

pub fn path_config() -> PathConfig {
    PathConfig::default()
        .error_handler(|_err, _request| ApiError::new(ErrorCode::InvalidRequest).into())
}

pub async fn not_found() -> HttpResponse {
    ApiError::new(ErrorCode::NotFound).error_response()
}
