pub mod health_service;

use std::sync::Arc;

use health_service::HealthService;

/// Shared service instances. Construct dependencies once during startup.
#[derive(Clone)]
pub struct Services {
    pub health_service: Arc<HealthService>,
}

impl Services {
    pub fn new(health_service: HealthService) -> Self {
        Self {
            health_service: Arc::new(health_service),
        }
    }
}
