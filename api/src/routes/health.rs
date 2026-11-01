use actix_web::{
    get,
    web::{self, Data, Json},
    Scope,
};

use crate::{dto::health::HealthResponse, state::Services};

#[get("/health")]
async fn check(services: Data<Services>) -> Json<HealthResponse> {
    Json(services.health.check())
}

pub fn health_routes() -> Scope {
    web::scope("").service(check)
}
