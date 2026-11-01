use env_logger::{Env, init_from_env};
use klemps_api::{app::create_server, config::Config};
use std::{io, net::TcpListener};

#[actix_web::main]
async fn main() -> io::Result<()> {
    init_from_env(Env::default().default_filter_or("info"));

    let config = Config::from_env().map_err(|error| {
        eprintln!("Startup configuration error: {error}");
        io::Error::new(io::ErrorKind::InvalidInput, error)
    })?;

    let listener = TcpListener::bind((config.host, config.port))?;
    log::info!("Starting API on {}:{}", config.host, config.port);

    create_server(listener, config)?.await
}
