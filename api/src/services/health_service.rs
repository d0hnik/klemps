use crate::{domain::health::HealthStatus, dto::health::HealthResponse};

#[derive(Default)]
pub struct HealthService;

impl HealthService {
    pub fn new() -> Self {
        Self
    }

    pub fn check(&self) -> HealthResponse {
        HealthResponse {
            status: HealthStatus::Healthy.as_str().to_owned(),
        }
    }
}
