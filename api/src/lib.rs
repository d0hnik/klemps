pub mod config;
pub mod domain;
pub mod dto;
pub mod http;
pub mod routes;
pub mod services;
pub mod state;

use crate::{config::Config, http::error::ApiError, state::AppState};
use axum::{
    Router,
    extract::Request,
    http::{Method, StatusCode, header},
    middleware::{self, Next},
    response::{IntoResponse, Response},
};
use tower_http::{cors::CorsLayer, limit::RequestBodyLimitLayer, trace::TraceLayer};

pub fn app(config: &Config) -> Router {
    apply_middleware(routes::router().with_state(AppState::default()), config)
}

fn apply_middleware(router: Router, config: &Config) -> Router {
    let timeout = config.request_timeout;
    router
        .fallback(|| async { ApiError::new(StatusCode::NOT_FOUND, "not_found", "Route not found") })
        .method_not_allowed_fallback(|| async { ApiError::new(StatusCode::METHOD_NOT_ALLOWED, "method_not_allowed", "Method not allowed") })
        .layer(RequestBodyLimitLayer::new(config.body_limit))
        .layer(middleware::from_fn(|request: Request, next: Next| async move {
            let response = next.run(request).await;
            if response.status() == StatusCode::PAYLOAD_TOO_LARGE {
                ApiError::new(StatusCode::PAYLOAD_TOO_LARGE, "body_too_large", "Request body exceeds the limit").into_response()
            } else { response }
        }))
        .layer(middleware::from_fn(move |request: Request, next: Next| async move {
            match tokio::time::timeout(timeout, next.run(request)).await {
                Ok(response) => response,
                Err(_) => ApiError::new(StatusCode::GATEWAY_TIMEOUT, "request_timeout", "Request timed out").into_response(),
            }
        }))
        .layer(CorsLayer::new().allow_origin(config.allowed_origins.clone()).allow_credentials(true)
            .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::OPTIONS])
            .allow_headers([header::CONTENT_TYPE]))
        .layer(TraceLayer::new_for_http()
            .make_span_with(|request: &Request| tracing::info_span!("http_request", method = %request.method()))
            .on_response(|response: &Response, latency: std::time::Duration, _span: &tracing::Span| {
                tracing::info!(status = response.status().as_u16(), latency_ms = latency.as_millis() as u64, "request completed");
            }))
}

#[cfg(test)]
mod tests;
