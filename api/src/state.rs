use crate::services::health_service::HealthService;

pub struct Services {
    pub health: HealthService,
}

impl Services {
    pub fn new() -> Self {
        Self {
            health: HealthService::new(),
        }
    }
}

impl Default for Services {
    fn default() -> Self {
        Self::new()
    }
}
