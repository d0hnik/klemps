use actix_web::{
    dev::ServiceResponse,
    http::{header, StatusCode},
    middleware::{ErrorHandlerResponse, ErrorHandlers, Logger},
    ResponseError,
};

use crate::error::ApiError;

pub fn logger() -> Logger {
    Logger::default()
}

/// Wrap Actix-generated HTTP errors (for example, the empty 405 response)
/// in the same envelope as service errors. Leave our existing JSON errors alone.
pub fn errors<B: 'static>() -> ErrorHandlers<B> {
    ErrorHandlers::new()
        .handler(StatusCode::BAD_REQUEST, normalize_error)
        .handler(StatusCode::UNAUTHORIZED, normalize_error)
        .handler(StatusCode::FORBIDDEN, normalize_error)
        .handler(StatusCode::NOT_FOUND, normalize_error)
        .handler(StatusCode::METHOD_NOT_ALLOWED, normalize_error)
        .handler(StatusCode::CONFLICT, normalize_error)
        .handler(StatusCode::PAYLOAD_TOO_LARGE, normalize_error)
        .handler(StatusCode::INTERNAL_SERVER_ERROR, normalize_error)
}

fn normalize_error<B>(response: ServiceResponse<B>) -> actix_web::Result<ErrorHandlerResponse<B>> {
    // ResponseError already produces an application/json envelope.
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

    // Preserve Actix's Allow header for method-not-allowed responses.
    if let Some(allow) = original.headers().get(header::ALLOW) {
        replacement.headers_mut().insert(header::ALLOW, allow.clone());
    }

    let response = ServiceResponse::new(request, replacement).map_into_right_body();
    Ok(ErrorHandlerResponse::Response(response))
}
