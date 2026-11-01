use actix_web::{
    dev::ServiceResponse,
    http::{header, StatusCode},
    middleware::{ErrorHandlerResponse, ErrorHandlers},
    ResponseError,
};

use crate::error::ApiError;

pub fn errors<B: 'static>() -> ErrorHandlers<B> {
    ErrorHandlers::new()
        .handler(StatusCode::BAD_REQUEST, normalize_error)
        .handler(StatusCode::UNAUTHORIZED, normalize_error)
        .handler(StatusCode::FORBIDDEN, normalize_error)
        .handler(StatusCode::NOT_FOUND, normalize_error)
        .handler(StatusCode::METHOD_NOT_ALLOWED, normalize_error)
        .handler(StatusCode::CONFLICT, normalize_error)
        .handler(StatusCode::PAYLOAD_TOO_LARGE, normalize_error)
        .handler(StatusCode::TOO_MANY_REQUESTS, normalize_error)
        .handler(StatusCode::INTERNAL_SERVER_ERROR, normalize_error)
}

fn normalize_error<B>(response: ServiceResponse<B>) -> actix_web::Result<ErrorHandlerResponse<B>> {
    // Error responses built by our ApiError or the rate limiter already have the
    // documented JSON envelope. Never rewrite those or lose their body.
    let is_json = response
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .is_some_and(|value| value.starts_with("application/json"));

    if is_json {
        return Ok(ErrorHandlerResponse::Response(response.map_into_left_body()));
    }

    let error = ApiError::from_status(response.status());
    let (request, original) = response.into_parts();
    let mut replacement = error.error_response();

    // Keep protocol/security headers if we replace an Actix/CORS-produced body.
    // Never copy the original Content-Type or Content-Length.
    for name in [
        header::ALLOW,
        header::RETRY_AFTER,
        header::ACCESS_CONTROL_ALLOW_ORIGIN,
        header::ACCESS_CONTROL_ALLOW_CREDENTIALS,
        header::ACCESS_CONTROL_EXPOSE_HEADERS,
        header::VARY,
    ] {
        if let Some(value) = original.headers().get(&name) {
            replacement.headers_mut().insert(name, value.clone());
        }
    }

    Ok(ErrorHandlerResponse::Response(
        ServiceResponse::new(request, replacement).map_into_right_body(),
    ))
}
