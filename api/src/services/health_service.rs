use crate::domain::Health;

pub struct HealthService;

impl HealthService {
    pub fn check(&self) -> Health {
        Health { status: "ok" }
    }
}
