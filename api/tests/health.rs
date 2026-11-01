use actix_web::{http::StatusCode, test, web, App};
use klemps_api::{app, config::Config, middleware, state::Services};

#[actix_web::test]
async fn returns_health_json_without_auth_or_database() {
    let config = Config::parse("127.0.0.1", "3000").unwrap();
    let store = middleware::rate_limit::new_store();
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(Services::new()))
            .app_data(app::json_config())
            .app_data(app::query_config())
            .app_data(app::path_config())
            .wrap(middleware::cors::cors(&config.cors_allowed_origins))
            .wrap(middleware::errors::errors())
            .configure(|cfg| app::configure_routes(cfg, store, &config.rate_limit))
            .default_service(web::to(app::not_found)),
    )
    .await;

    let request = test::TestRequest::get().uri("/api/health").to_request();
    let response = test::call_service(&app, request).await;
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(
        response.headers().get("content-type").unwrap(),
        "application/json"
    );
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body, serde_json::json!({ "status": "ok" }));
}
