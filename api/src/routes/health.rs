use actix_web::{get, web::{self, Data}, Scope};

use crate::{dto::health::HealthResponse, state::Services};

#[get("/health")]
async fn check(services: Data<Services>) -> HealthResponse {
    services.health.check()
}

pub fn health_routes() -> Scope {
    web::scope("").service(check)
}
