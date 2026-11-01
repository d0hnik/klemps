use std::{env, fmt, net::IpAddr};

/// Runtime config: contains no passwords or tokens.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Config {
    pub host: IpAddr,
    pub port: u16,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ConfigError {
    InvalidHost,
    InvalidPort,
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Never include the user-supplied value in the error message.
        match self {
            Self::InvalidHost => write!(f, "HOST must be a valid IPv4 or IPv6 address"),
            Self::InvalidPort => write!(f, "PORT must be an integer from 1 to 65535"),
        }
    }
}

impl std::error::Error for ConfigError {}

impl Config {
    pub fn from_env() -> Result<Self, ConfigError> {
        // Treat invalid-Unicode environment values as invalid configuration,
        // not as a reason to dump the environment into the logs.
        let host = env::var("HOST").or_else(|err| match err {
            env::VarError::NotPresent => Ok("127.0.0.1".into()),
            env::VarError::NotUnicode(_) => Err(ConfigError::InvalidHost),
        })?;
        let port = env::var("PORT").or_else(|err| match err {
            env::VarError::NotPresent => Ok("3000".into()),
            env::VarError::NotUnicode(_) => Err(ConfigError::InvalidPort),
        })?;
        Self::parse(&host, &port)
    }

    pub fn parse(host: &str, port: &str) -> Result<Self, ConfigError> {
        let host = host.parse().map_err(|_| ConfigError::InvalidHost)?;
        let port: u16 = port.parse().map_err(|_| ConfigError::InvalidPort)?;
        if port == 0 {
            return Err(ConfigError::InvalidPort);
        }
        Ok(Self { host, port })
    }
}
