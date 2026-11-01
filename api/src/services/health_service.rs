use crate::domain::health::HealthStatus;

pub struct HealthService;

impl HealthService {
    pub fn new() -> Self {
        Self
    }

    pub fn check(&self) -> HealthStatus {
        HealthStatus::Healthy
    }
}

impl Default for HealthService {
    fn default() -> Self {
        Self::new()
    }
}
