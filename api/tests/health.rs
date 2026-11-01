use std::sync::Arc;

use actix_web::{test, web, App};
use klemps_api::{routes::health::health_routes, state::Services};

#[actix_web::test]
async fn health_endpoint_returns_ok() {
    let services = web::Data::from(Arc::new(Services::new()));
    let app = test::init_service(
        App::new()
            .app_data(services)
            .service(
                web::scope("/api")
                    .service(web::scope("/v1").service(health_routes())),
            ),
    )
    .await;

    let req = test::TestRequest::get()
        .uri("/api/v1/health")
        .to_request();
    let response = test::call_service(&app, req).await;

    assert_eq!(response.status(), actix_web::http::StatusCode::OK);
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body, serde_json::json!({"status": "ok"}));
}
