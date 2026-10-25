use crate::domain::Health;

#[derive(Clone, Default)]
pub struct HealthService;

impl HealthService {
    pub fn check(&self) -> Health {
        Health { status: "ok" }
    }
}
