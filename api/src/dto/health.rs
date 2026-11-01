use serde::Serialize;
use typeshare::typeshare;

#[typeshare]
#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
}

// Register this type as a JSON response without changing the route handler.
crate::impl_json_responder!(HealthResponse);
