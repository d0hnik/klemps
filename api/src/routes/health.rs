use actix_web::{Scope, get, web::{Data, Json, scope}};

use crate::{dto::health::HealthResponse, state::Services};

#[get("/health")]
async fn check(services: Data<Services>) -> Json<HealthResponse> {
    Json(services.health.check().into())
}

pub fn health_routes() -> Scope {
    scope("").service(check)
}
