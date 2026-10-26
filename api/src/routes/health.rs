use crate::{dto::health::HealthResponse, state::AppState};
use axum::{Json, Router, extract::State, routing::get};

pub fn router() -> Router<AppState> {
    Router::new().route("/api/health", get(get_health))
}

async fn get_health(State(state): State<AppState>) -> Json<HealthResponse> {
    Json(state.services.health_service.check().into())
}
