use std::fmt;

use actix_web::{HttpResponse, ResponseError, http::StatusCode};

use crate::dto::error::{ErrorBody, ErrorCode, ErrorResponse};

#[derive(Debug, Clone, Copy)]
pub struct ApiError {
    pub code: ErrorCode,
}

impl ApiError {
    pub const fn new(code: ErrorCode) -> Self {
        Self { code }
    }

    pub const fn status(&self) -> StatusCode {
        match self.code {
            ErrorCode::InvalidRequest => StatusCode::BAD_REQUEST,
            ErrorCode::Unauthorized => StatusCode::UNAUTHORIZED,
            ErrorCode::Forbidden => StatusCode::FORBIDDEN,
            ErrorCode::NotFound => StatusCode::NOT_FOUND,
            ErrorCode::MethodNotAllowed => StatusCode::METHOD_NOT_ALLOWED,
            ErrorCode::Conflict => StatusCode::CONFLICT,
            ErrorCode::PayloadTooLarge => StatusCode::PAYLOAD_TOO_LARGE,
            ErrorCode::RateLimited => StatusCode::TOO_MANY_REQUESTS,
            ErrorCode::InternalError => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub const fn message(&self) -> &'static str {
        match self.code {
            ErrorCode::InvalidRequest => "Invalid request",
            ErrorCode::Unauthorized => "Authentication required",
            ErrorCode::Forbidden => "Access denied",
            ErrorCode::NotFound => "Resource not found",
            ErrorCode::MethodNotAllowed => "Method not allowed",
            ErrorCode::Conflict => "Resource conflict",
            ErrorCode::PayloadTooLarge => "Request body too large",
            ErrorCode::RateLimited => "Too many requests",
            ErrorCode::InternalError => "Internal server error",
        }
    }

    pub fn from_status(status: StatusCode) -> Self {
        let code = match status {
            StatusCode::BAD_REQUEST | StatusCode::UNPROCESSABLE_ENTITY => ErrorCode::InvalidRequest,
            StatusCode::UNAUTHORIZED => ErrorCode::Unauthorized,
            StatusCode::FORBIDDEN => ErrorCode::Forbidden,
            StatusCode::NOT_FOUND => ErrorCode::NotFound,
            StatusCode::METHOD_NOT_ALLOWED => ErrorCode::MethodNotAllowed,
            StatusCode::CONFLICT => ErrorCode::Conflict,
            StatusCode::PAYLOAD_TOO_LARGE => ErrorCode::PayloadTooLarge,
            StatusCode::TOO_MANY_REQUESTS => ErrorCode::RateLimited,
            _ => ErrorCode::InternalError,
        };
        Self::new(code)
    }

    pub fn to_response(self) -> ErrorResponse {
        ErrorResponse {
            error: ErrorBody {
                code: self.code,
                message: self.message().to_owned(),
            },
        }
    }
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.message())
    }
}

impl std::error::Error for ApiError {}

impl ResponseError for ApiError {
    fn status_code(&self) -> StatusCode {
        self.status()
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status()).json(self.to_response())
    }
}
