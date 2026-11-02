use std::net::{IpAddr, Ipv4Addr, SocketAddr};

use actix_web::{
    App,
    http::{StatusCode, header},
    test, web,
};
use klemps_api::{app, config::Config, middleware, state::Services};

#[actix_web::test]
async fn allowed_origin_receives_cors_headers() {
    let config =
        Config::parse_all("127.0.0.1", "3000", "http://localhost:5173", "10", "60").unwrap();
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(Services::new()))
            .wrap(middleware::cors::cors(&config.cors_allowed_origins))
            .wrap(middleware::errors::errors())
            .configure(|cfg| {
                app::configure_routes(cfg, middleware::rate_limit::new_store(), &config.rate_limit)
            }),
    )
    .await;
    let response = test::call_service(
        &app,
        test::TestRequest::get()
            .uri("/api/health")
            .insert_header((header::ORIGIN, "http://localhost:5173"))
            .to_request(),
    )
    .await;
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(
        response
            .headers()
            .get(header::ACCESS_CONTROL_ALLOW_ORIGIN)
            .unwrap(),
        "http://localhost:5173"
    );
}

#[actix_web::test]
async fn disallowed_origin_does_not_receive_cors_access() {
    let config =
        Config::parse_all("127.0.0.1", "3000", "http://localhost:5173", "10", "60").unwrap();
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(Services::new()))
            .wrap(middleware::cors::cors(&config.cors_allowed_origins))
            .wrap(middleware::errors::errors())
            .configure(|cfg| {
                app::configure_routes(cfg, middleware::rate_limit::new_store(), &config.rate_limit)
            }),
    )
    .await;
    let response = test::call_service(
        &app,
        test::TestRequest::get()
            .uri("/api/health")
            .insert_header((header::ORIGIN, "https://not-allowed.example"))
            .to_request(),
    )
    .await;
    assert!(
        response
            .headers()
            .get(header::ACCESS_CONTROL_ALLOW_ORIGIN)
            .is_none()
    );
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body["error"]["code"], "INVALID_REQUEST");
}

#[actix_web::test]
async fn api_v1_requests_are_limited_but_health_is_not() {
    let config =
        Config::parse_all("127.0.0.1", "3000", "http://localhost:5173", "2", "60").unwrap();
    let store = middleware::rate_limit::new_store();
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(Services::new()))
            .wrap(middleware::errors::errors())
            .configure(|cfg| app::configure_routes(cfg, store, &config.rate_limit))
            .default_service(web::to(app::not_found)),
    )
    .await;
    let address = SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 45000);

    for _ in 0..2 {
        let response = test::call_service(
            &app,
            test::TestRequest::get()
                .uri("/api/v1/missing")
                .peer_addr(address)
                .to_request(),
        )
        .await;
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }
    let response = test::call_service(
        &app,
        test::TestRequest::get()
            .uri("/api/v1/missing")
            .peer_addr(address)
            .to_request(),
    )
    .await;
    assert_eq!(response.status(), StatusCode::TOO_MANY_REQUESTS);
    assert!(response.headers().contains_key(header::RETRY_AFTER));
    let body: serde_json::Value = test::read_body_json(response).await;
    assert_eq!(body["error"]["code"], "RATE_LIMITED");

    // Public health isn't throttled by the /v1 scope even from the same IP.
    for _ in 0..3 {
        let response = test::call_service(
            &app,
            test::TestRequest::get()
                .uri("/api/health")
                .peer_addr(address)
                .to_request(),
        )
        .await;
        assert_eq!(response.status(), StatusCode::OK);
    }
}

#[actix_web::test]
async fn forwarded_for_does_not_override_peer_ip() {
    let config =
        Config::parse_all("127.0.0.1", "3000", "http://localhost:5173", "1", "60").unwrap();
    let store = middleware::rate_limit::new_store();
    let app = test::init_service(
        App::new()
            .wrap(middleware::errors::errors())
            .configure(|cfg| app::configure_routes(cfg, store, &config.rate_limit)),
    )
    .await;
    let address = SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 45000);
    let call = |forwarded: &'static str| {
        test::TestRequest::get()
            .uri("/api/v1/missing")
            .peer_addr(address)
            .insert_header(("X-Forwarded-For", forwarded))
            .to_request()
    };
    let first = test::call_service(&app, call("192.0.2.10")).await;
    assert_eq!(first.status(), StatusCode::NOT_FOUND);
    let second = test::call_service(&app, call("192.0.2.11")).await;
    assert_eq!(second.status(), StatusCode::TOO_MANY_REQUESTS);
}

#[actix_web::test]
async fn distinct_app_instances_share_the_same_rate_limit_store() {
    let config =
        Config::parse_all("127.0.0.1", "3000", "http://localhost:5173", "1", "60").unwrap();
    let store = middleware::rate_limit::new_store();
    let first_app = test::init_service(
        App::new()
            .wrap(middleware::errors::errors())
            .configure(|cfg| app::configure_routes(cfg, store.clone(), &config.rate_limit)),
    )
    .await;
    let second_app = test::init_service(
        App::new()
            .wrap(middleware::errors::errors())
            .configure(|cfg| app::configure_routes(cfg, store.clone(), &config.rate_limit)),
    )
    .await;

    let address = SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 45001);
    let request = || {
        test::TestRequest::get()
            .uri("/api/v1/missing")
            .peer_addr(address)
            .to_request()
    };
    assert_eq!(
        test::call_service(&first_app, request()).await.status(),
        StatusCode::NOT_FOUND,
    );
    assert_eq!(
        test::call_service(&second_app, request()).await.status(),
        StatusCode::TOO_MANY_REQUESTS,
    );
}
