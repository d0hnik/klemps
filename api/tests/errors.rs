use actix_web::{
    App, HttpResponse,
    http::{StatusCode, header},
    test, web,
};
use klemps_api::{
    app, config::Config, dto::error::ErrorCode, error::ApiError, middleware, state::Services,
};
use serde::Deserialize;

#[derive(Deserialize)]
struct Payload {
    #[allow(dead_code)]
    data: String,
}

async fn require_json(_payload: web::Json<Payload>) -> HttpResponse {
    HttpResponse::NoContent().finish()
}

async fn fail_with_conflict() -> Result<HttpResponse, ApiError> {
    Err(ApiError::new(ErrorCode::Conflict))
}

async fn fail_internally() -> Result<HttpResponse, ApiError> {
    Err(ApiError::new(ErrorCode::InternalError))
}

#[actix_web::test]
async fn missing_route_returns_json_404() {
    let config = Config::parse("127.0.0.1", "3000").unwrap();
    let store = middleware::rate_limit::new_store();
    let app = test::init_service(
        App::new()
            .wrap(middleware::errors::errors())
            .configure(|cfg| app::configure_routes(cfg, store, &config.rate_limit))
            .default_service(web::to(app::not_found)),
    )
    .await;

    let response = test::call_service(
        &app,
        test::TestRequest::get()
            .uri("/api/does-not-exist")
            .to_request(),
    )
    .await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body["error"]["code"], "NOT_FOUND");
}

#[actix_web::test]
async fn unsupported_method_returns_json_405() {
    let config = Config::parse("127.0.0.1", "3000").unwrap();
    let store = middleware::rate_limit::new_store();
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(Services::new()))
            .wrap(middleware::errors::errors())
            .configure(|cfg| app::configure_routes(cfg, store, &config.rate_limit))
            .default_service(web::to(app::not_found)),
    )
    .await;

    let response = test::call_service(
        &app,
        test::TestRequest::post().uri("/api/health").to_request(),
    )
    .await;
    assert_eq!(response.status(), StatusCode::METHOD_NOT_ALLOWED);
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body["error"]["code"], "METHOD_NOT_ALLOWED");
}

#[actix_web::test]
async fn malformed_json_returns_consistent_error() {
    let app = test::init_service(
        App::new()
            .app_data(app::json_config())
            .wrap(middleware::errors::errors())
            .service(web::resource("/__test/parse").route(web::post().to(require_json))),
    )
    .await;

    let response = test::call_service(
        &app,
        test::TestRequest::post()
            .uri("/__test/parse")
            .insert_header((header::CONTENT_TYPE, "application/json"))
            .set_payload("{invalid json")
            .to_request(),
    )
    .await;
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body["error"]["code"], "INVALID_REQUEST");
}

#[actix_web::test]
async fn oversized_json_returns_413_envelope() {
    let app = test::init_service(
        App::new()
            .app_data(app::json_config())
            .wrap(middleware::errors::errors())
            .service(web::resource("/__test/parse").route(web::post().to(require_json))),
    )
    .await;
    let big_json = format!(r#"{{"data":"{}"}}"#, "a".repeat(app::MAX_JSON_BYTES));
    let response = test::call_service(
        &app,
        test::TestRequest::post()
            .uri("/__test/parse")
            .insert_header((header::CONTENT_TYPE, "application/json"))
            .set_payload(big_json)
            .to_request(),
    )
    .await;
    assert_eq!(response.status(), StatusCode::PAYLOAD_TOO_LARGE);
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body["error"]["code"], "PAYLOAD_TOO_LARGE");
}

#[actix_web::test]
async fn application_conflict_returns_stable_envelope() {
    let app = test::init_service(
        App::new()
            .wrap(middleware::errors::errors())
            .service(web::resource("/__test/conflict").route(web::get().to(fail_with_conflict))),
    )
    .await;
    let response = test::call_service(
        &app,
        test::TestRequest::get()
            .uri("/__test/conflict")
            .to_request(),
    )
    .await;
    assert_eq!(response.status(), StatusCode::CONFLICT);
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body["error"]["code"], "CONFLICT");
}

#[actix_web::test]
async fn internal_error_does_not_expose_details() {
    let app = test::init_service(
        App::new()
            .wrap(middleware::errors::errors())
            .service(web::resource("/__test/internal").route(web::get().to(fail_internally))),
    )
    .await;
    let response = test::call_service(
        &app,
        test::TestRequest::get()
            .uri("/__test/internal")
            .to_request(),
    )
    .await;
    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body["error"]["code"], "INTERNAL_ERROR");
    assert_eq!(body["error"]["message"], "Internal server error");
}
