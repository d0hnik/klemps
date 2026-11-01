use std::io;

use actix_web::{
    App, HttpServer,
    web::{Data, to},
};
use env_logger::{Env, init_from_env};
use klemps_api::{
    app::{configure_routes, json_config, not_found, path_config, query_config},
    config::Config,
    middleware::{cors::cors, errors::errors, logger, rate_limit::new_store},
    state::Services,
};

#[actix_web::main]
async fn main() -> io::Result<()> {
    init_from_env(Env::default().default_filter_or("info"));

    let config = Config::from_env().map_err(|error| {
        eprintln!("Startup configuration error: {error}");
        io::Error::new(io::ErrorKind::InvalidInput, error)
    })?;

    let bind_addr = (config.host, config.port);
    let services = Data::new(Services::new());
    log::info!("Starting API on {}:{}", config.host, config.port);

    HttpServer::new(move || {
        App::new()
            .app_data(services.clone())
            .app_data(json_config())
            .app_data(query_config())
            .app_data(path_config())
            .wrap(cors(&config.cors_allowed_origins))
            .wrap(errors())
            .wrap(logger())
            .configure(|cfg| configure_routes(cfg, new_store(), &config.rate_limit))
            .default_service(to(not_found))
    })
    .bind(bind_addr)?
    .run()
    .await
}
