use serde::Serialize;
use typeshare::typeshare;

#[typeshare]
#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
}

crate::impl_json_responder!(HealthResponse);
