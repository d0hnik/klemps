use actix_web::{
    Scope,
    web::{self, Data, Json},
};

use crate::{dto::health::HealthResponse, state::Services};

async fn check(services: Data<Services>) -> Json<HealthResponse> {
    Json(services.health.check())
}

pub fn health_routes() -> Scope {
    web::scope("").service(web::resource("/health").route(web::get().to(check)))
}
