use actix_web::{http::StatusCode, test, web, App};
use klemps_api::{routes::health::health_routes, state::Services};

#[actix_web::test]
async fn returns_health_json() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(Services::new()))
            .service(web::scope("/api/v1").service(health_routes())),
    )
    .await;

    let request = test::TestRequest::get().uri("/api/v1/health").to_request();
    let response = test::call_service(&app, request).await;

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(
        response.headers().get("content-type").unwrap(),
        "application/json"
    );
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body, serde_json::json!({ "status": "ok" }));
}
