use serde::Serialize;

use crate::domain::health::HealthStatus;

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
}

impl From<HealthStatus> for HealthResponse {
    fn from(status: HealthStatus) -> Self {
        match status {
            HealthStatus::Healthy => Self { status: "ok" },
        }
    }
}
