use crate::services::health_service::HealthService;

#[derive(Clone, Default)]
pub struct AppState {
    pub health_service: HealthService,
}
