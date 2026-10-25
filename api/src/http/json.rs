use super::error::ApiError;
use axum::{
    Json,
    extract::{FromRequest, Request},
    http::StatusCode,
};
use serde::de::DeserializeOwned;

/// Use this extractor for JSON request DTOs so rejection bodies stay consistent.
pub struct ApiJson<T>(pub T);

impl<S, T> FromRequest<S> for ApiJson<T>
where
    S: Send + Sync,
    T: DeserializeOwned,
{
    type Rejection = ApiError;

    async fn from_request(request: Request, state: &S) -> Result<Self, Self::Rejection> {
        Json::<T>::from_request(request, state)
            .await
            .map(|Json(value)| Self(value))
            .map_err(|error| match error.status() {
                StatusCode::PAYLOAD_TOO_LARGE => ApiError::new(
                    StatusCode::PAYLOAD_TOO_LARGE,
                    "body_too_large",
                    "Request body exceeds the limit",
                ),
                StatusCode::UNSUPPORTED_MEDIA_TYPE => ApiError::new(
                    StatusCode::UNSUPPORTED_MEDIA_TYPE,
                    "unsupported_media_type",
                    "Expected application/json",
                ),
                _ => ApiError::new(
                    StatusCode::BAD_REQUEST,
                    "invalid_json",
                    "Request JSON is malformed or invalid",
                ),
            })
    }
}
