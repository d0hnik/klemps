use crate::{app, apply_middleware, config::Config, http::json::ApiJson};
use axum::{
    Router,
    body::{Body, to_bytes},
    http::{Request, StatusCode},
    routing::{get, post},
};
use serde::Deserialize;
use serde_json::Value;
use tower::ServiceExt;

fn config() -> Config {
    Config::from_lookup(|_| None).unwrap()
}

async fn json_response(router: Router, request: Request<Body>, status: StatusCode) -> Value {
    let response = router.oneshot(request).await.unwrap();
    assert_eq!(response.status(), status);
    assert_eq!(response.headers()["content-type"], "application/json");
    serde_json::from_slice(&to_bytes(response.into_body(), 4096).await.unwrap()).unwrap()
}

#[tokio::test]
async fn health_runs_through_router_service_and_dto_without_database() {
    let value = json_response(
        app(&config()),
        Request::builder()
            .uri("/api/health")
            .body(Body::empty())
            .unwrap(),
        StatusCode::OK,
    )
    .await;
    assert_eq!(value, serde_json::json!({"status":"ok"}));
}

#[tokio::test]
async fn missing_routes_and_wrong_methods_use_stable_errors() {
    for (method, path, status, code) in [
        ("GET", "/missing", StatusCode::NOT_FOUND, "not_found"),
        (
            "POST",
            "/api/health",
            StatusCode::METHOD_NOT_ALLOWED,
            "method_not_allowed",
        ),
    ] {
        let value = json_response(
            app(&config()),
            Request::builder()
                .method(method)
                .uri(path)
                .body(Body::empty())
                .unwrap(),
            status,
        )
        .await;
        assert_eq!(value["error"]["code"], code);
    }
}

#[derive(Deserialize)]
struct Input {
    name: String,
}
async fn accept_json(ApiJson(input): ApiJson<Input>) -> String {
    input.name
}
fn json_router(config: &Config) -> Router {
    apply_middleware(Router::new().route("/input", post(accept_json)), config)
}

#[tokio::test]
async fn json_rejections_do_not_echo_private_input() {
    for (content_type, body, status, code) in [
        (
            "application/json",
            "{secret",
            StatusCode::BAD_REQUEST,
            "invalid_json",
        ),
        (
            "application/json",
            "{\"name\":123}",
            StatusCode::BAD_REQUEST,
            "invalid_json",
        ),
        (
            "text/plain",
            "secret",
            StatusCode::UNSUPPORTED_MEDIA_TYPE,
            "unsupported_media_type",
        ),
    ] {
        let value = json_response(
            json_router(&config()),
            Request::builder()
                .method("POST")
                .uri("/input")
                .header("content-type", content_type)
                .body(Body::from(body))
                .unwrap(),
            status,
        )
        .await;
        assert_eq!(value["error"]["code"], code);
        assert!(!value.to_string().contains("secret"));
    }
}

#[tokio::test]
async fn oversized_bodies_are_rejected_with_and_without_content_length() {
    let mut config = config();
    config.body_limit = 16;
    for content_length in [false, true] {
        let mut request = Request::builder()
            .method("POST")
            .uri("/input")
            .header("content-type", "application/json");
        let body = "x".repeat(64);
        if content_length {
            request = request.header("content-length", body.len());
        }
        let value = json_response(
            json_router(&config),
            request.body(Body::from(body)).unwrap(),
            StatusCode::PAYLOAD_TOO_LARGE,
        )
        .await;
        assert_eq!(value["error"]["code"], "body_too_large");
    }
}

#[tokio::test]
async fn request_timeout_returns_json() {
    let mut config = config();
    config.request_timeout = std::time::Duration::from_millis(10);
    let router = apply_middleware(
        Router::new().route(
            "/slow",
            get(|| async {
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
                "done"
            }),
        ),
        &config,
    );
    let value = json_response(
        router,
        Request::builder().uri("/slow").body(Body::empty()).unwrap(),
        StatusCode::GATEWAY_TIMEOUT,
    )
    .await;
    assert_eq!(value["error"]["code"], "request_timeout");
}

#[tokio::test]
async fn cors_permits_only_configured_origins() {
    for (origin, allowed) in [
        ("http://localhost:5173", true),
        ("https://attacker.example", false),
    ] {
        let response = app(&config())
            .oneshot(
                Request::builder()
                    .method("OPTIONS")
                    .uri("/api/health")
                    .header("origin", origin)
                    .header("access-control-request-method", "GET")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(
            response
                .headers()
                .get("access-control-allow-origin")
                .is_some(),
            allowed
        );
        if allowed {
            assert_eq!(response.headers()["access-control-allow-origin"], origin);
        }
    }
}

#[test]
fn invalid_configuration_fails_without_echoing_values() {
    for (key, value) in [
        ("API_BIND_ADDRESS", "secret"),
        ("API_ALLOWED_ORIGINS", "*"),
        ("API_ALLOWED_ORIGINS", "https://user:secret@example.com"),
        ("API_ALLOWED_ORIGINS", "https://example.com/path"),
        ("API_BODY_LIMIT_BYTES", "0"),
        ("API_BODY_LIMIT_BYTES", "1048577"),
        ("API_REQUEST_TIMEOUT_SECONDS", "0"),
        ("API_REQUEST_TIMEOUT_SECONDS", "121"),
    ] {
        let error = Config::from_lookup(|name| (name == key).then(|| value.to_owned()))
            .err()
            .expect("invalid config accepted");
        assert!(!error.contains("secret"));
    }
}
