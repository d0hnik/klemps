use std::{
    env::{VarError, var},
    fmt,
    net::IpAddr,
};

use url::Url;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RateLimitSettings {
    pub requests_per_window: usize,
    pub window_seconds: u64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Config {
    pub host: IpAddr,
    pub port: u16,
    pub cors_allowed_origins: Vec<String>,
    pub rate_limit: RateLimitSettings,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ConfigError {
    InvalidHost,
    InvalidPort,
    InvalidCorsOrigins,
    InvalidRateLimitRequests,
    InvalidRateLimitWindow,
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let message = match self {
            Self::InvalidHost => "HOST must be a valid IPv4 or IPv6 address",
            Self::InvalidPort => "PORT must be an integer from 1 to 65535",
            Self::InvalidCorsOrigins => "CORS_ALLOWED_ORIGINS must list valid HTTP(S) origins",
            Self::InvalidRateLimitRequests => "RATE_LIMIT_REQUESTS must be a positive integer",
            Self::InvalidRateLimitWindow => "RATE_LIMIT_WINDOW_SECONDS must be a positive integer",
        };
        f.write_str(message)
    }
}

impl std::error::Error for ConfigError {}

impl Config {
    pub fn from_env() -> Result<Self, ConfigError> {
        let host = read_var("HOST", "127.0.0.1", ConfigError::InvalidHost)?;
        let port = read_var("PORT", "3000", ConfigError::InvalidPort)?;
        let origins = read_var(
            "CORS_ALLOWED_ORIGINS",
            "http://localhost:5173",
            ConfigError::InvalidCorsOrigins,
        )?;
        let requests = read_var(
            "RATE_LIMIT_REQUESTS",
            "120",
            ConfigError::InvalidRateLimitRequests,
        )?;
        let window = read_var(
            "RATE_LIMIT_WINDOW_SECONDS",
            "60",
            ConfigError::InvalidRateLimitWindow,
        )?;
        Self::parse_all(&host, &port, &origins, &requests, &window)
    }

    pub fn parse(host: &str, port: &str) -> Result<Self, ConfigError> {
        Self::parse_all(host, port, "http://localhost:5173", "120", "60")
    }

    pub fn parse_all(
        host: &str,
        port: &str,
        origins: &str,
        requests: &str,
        window: &str,
    ) -> Result<Self, ConfigError> {
        let host = host.parse().map_err(|_| ConfigError::InvalidHost)?;
        let port: u16 = port.parse().map_err(|_| ConfigError::InvalidPort)?;
        if port == 0 {
            return Err(ConfigError::InvalidPort);
        }

        let cors_allowed_origins: Vec<String> = origins
            .split(',')
            .map(str::trim)
            .map(validate_origin)
            .collect::<Result<_, _>>()?;
        if cors_allowed_origins.is_empty() {
            return Err(ConfigError::InvalidCorsOrigins);
        }

        let requests_per_window: usize = requests
            .parse()
            .map_err(|_| ConfigError::InvalidRateLimitRequests)?;
        if requests_per_window == 0 {
            return Err(ConfigError::InvalidRateLimitRequests);
        }
        let window_seconds: u64 = window
            .parse()
            .map_err(|_| ConfigError::InvalidRateLimitWindow)?;
        if window_seconds == 0 {
            return Err(ConfigError::InvalidRateLimitWindow);
        }

        Ok(Self {
            host,
            port,
            cors_allowed_origins,
            rate_limit: RateLimitSettings {
                requests_per_window,
                window_seconds,
            },
        })
    }
}

fn read_var(name: &str, default: &str, error: ConfigError) -> Result<String, ConfigError> {
    match var(name) {
        Ok(value) => Ok(value),
        Err(VarError::NotPresent) => Ok(default.to_owned()),
        Err(VarError::NotUnicode(_)) => Err(error),
    }
}

fn validate_origin(input: &str) -> Result<String, ConfigError> {
    let url = Url::parse(input).map_err(|_| ConfigError::InvalidCorsOrigins)?;
    let origin = url.origin().ascii_serialization();
    if !matches!(url.scheme(), "http" | "https")
        || url.host_str().is_none()
        || !url.username().is_empty()
        || url.password().is_some()
        || origin != input
    {
        return Err(ConfigError::InvalidCorsOrigins);
    }
    Ok(origin)
}
