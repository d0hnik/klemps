use crate::domain::Health;
use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
}

impl From<Health> for HealthResponse {
    fn from(health: Health) -> Self {
        Self {
            status: health.status,
        }
    }
}
