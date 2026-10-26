use crate::services::Services;

#[derive(Clone)]
pub struct AppState {
    pub services: Services,
}

impl AppState {
    pub fn new(services: Services) -> Self {
        Self { services }
    }
}
