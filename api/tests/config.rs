use klemps_api::config::{Config, ConfigError};

#[test]
fn valid_configuration_is_accepted() {
    let cfg = Config::parse("127.0.0.1", "3000").unwrap();
    assert_eq!(cfg.port, 3000);
    let ipv6 = Config::parse("::1", "8080").unwrap();
    assert_eq!(ipv6.port, 8080);
}

#[test]
fn invalid_port_is_rejected_without_echoing_its_value() {
    let secret_like_input = "some-private-secret:not-a-port";
    let err = Config::parse("127.0.0.1", secret_like_input).unwrap_err();
    assert_eq!(err, ConfigError::InvalidPort);
    assert!(!err.to_string().contains(secret_like_input));
    assert!(err.to_string().contains("PORT"));
    assert!(Config::parse("127.0.0.1", "0").is_err());
    assert!(Config::parse("127.0.0.1", "65536").is_err());
}

#[test]
fn invalid_host_is_rejected_without_echoing_its_value() {
    let secret_like_input = "password-do-not-print";
    let err = Config::parse(secret_like_input, "3000").unwrap_err();
    assert_eq!(err, ConfigError::InvalidHost);
    assert!(!err.to_string().contains(secret_like_input));
    assert!(err.to_string().contains("HOST"));
}

#[test]
fn invalid_configuration_prevents_server_startup_without_leaking_values() {
    use std::process::Command;

    let sentinel = "sensitive-value-not-for-logs";
    let output = Command::new(env!("CARGO_BIN_EXE_klemps-api"))
        .env("PORT", sentinel)
        .env("HOST", "127.0.0.1")
        .output()
        .expect("the built API executable should be available to integration tests");

    assert!(!output.status.success());
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(stderr.contains("Startup configuration error:"));
    assert!(stderr.contains("PORT"));
    assert!(!stderr.contains(sentinel));
}

#[test]
fn security_configuration_is_validated_without_leaking_values() {
    let bad_origin = "https://password@host.example";
    let err = Config::parse_all("127.0.0.1", "3000", bad_origin, "120", "60")
        .unwrap_err();
    assert_eq!(err, ConfigError::InvalidCorsOrigins);
    assert!(!err.to_string().contains("password"));

    assert_eq!(
        Config::parse_all("127.0.0.1", "3000", "http://localhost:5173", "0", "60")
            .unwrap_err(),
        ConfigError::InvalidRateLimitRequests,
    );
    assert_eq!(
        Config::parse_all("127.0.0.1", "3000", "http://localhost:5173", "120", "0")
            .unwrap_err(),
        ConfigError::InvalidRateLimitWindow,
    );
}

#[test]
fn multiple_cors_origins_are_supported() {
    let config = Config::parse_all(
        "127.0.0.1", "3000", "http://localhost:5173,https://klemps.example", "120", "60"
    ).unwrap();
    assert_eq!(config.cors_allowed_origins.len(), 2);
    assert_eq!(config.rate_limit.requests_per_window, 120);
}
