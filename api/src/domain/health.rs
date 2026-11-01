#[derive(Debug, Clone, Copy)]
pub enum HealthStatus {
    Healthy,
}

impl HealthStatus {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Healthy => "ok",
        }
    }
}
