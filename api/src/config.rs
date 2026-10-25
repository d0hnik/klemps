use axum::http::HeaderValue;
use std::{net::SocketAddr, time::Duration};
use tracing_subscriber::EnvFilter;

pub struct Config {
    pub bind_address: SocketAddr,
    pub allowed_origins: Vec<HeaderValue>,
    pub body_limit: usize,
    pub request_timeout: Duration,
    pub log_filter: EnvFilter,
}

impl Config {
    pub fn from_env() -> Result<Self, &'static str> {
        Self::from_lookup(|key| std::env::var(key).ok())
    }

    pub fn from_lookup(lookup: impl Fn(&str) -> Option<String>) -> Result<Self, &'static str> {
        let value = |key, default: &str| lookup(key).unwrap_or_else(|| default.to_owned());
        let bind_address = value("API_BIND_ADDRESS", "0.0.0.0:3000")
            .parse()
            .map_err(|_| "API_BIND_ADDRESS must be an IP address and port")?;
        let raw_origins = value(
            "API_ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        );
        let mut allowed_origins = Vec::new();
        for origin in raw_origins.split(',').map(str::trim) {
            let parsed = url::Url::parse(origin)
                .map_err(|_| "API_ALLOWED_ORIGINS must contain exact HTTP(S) origins")?;
            if !matches!(parsed.scheme(), "http" | "https")
                || parsed.origin().ascii_serialization() != origin
            {
                return Err(
                    "API_ALLOWED_ORIGINS must contain exact HTTP(S) origins without paths, credentials, or wildcards",
                );
            }
            allowed_origins.push(origin.parse().map_err(|_| "Invalid origin header")?);
        }
        let body_limit = value("API_BODY_LIMIT_BYTES", "16384")
            .parse::<usize>()
            .map_err(|_| "API_BODY_LIMIT_BYTES must be an integer")?;
        if !(1..=1_048_576).contains(&body_limit) {
            return Err("API_BODY_LIMIT_BYTES must be between 1 and 1048576");
        }
        let timeout = value("API_REQUEST_TIMEOUT_SECONDS", "10")
            .parse::<u64>()
            .map_err(|_| "API_REQUEST_TIMEOUT_SECONDS must be an integer")?;
        if !(1..=120).contains(&timeout) {
            return Err("API_REQUEST_TIMEOUT_SECONDS must be between 1 and 120");
        }
        let log_filter = EnvFilter::try_new(value("RUST_LOG", "info"))
            .map_err(|_| "RUST_LOG is not a valid tracing filter")?;
        Ok(Self {
            bind_address,
            allowed_origins,
            body_limit,
            request_timeout: Duration::from_secs(timeout),
            log_filter,
        })
    }
}
