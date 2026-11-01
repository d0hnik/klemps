use std::io;

use actix_web::{web, App, HttpServer};
use klemps_api::{app, config::Config, middleware, state::Services};

#[actix_web::main]
async fn main() -> io::Result<()> {
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    // Validate before initializing the server or any future database clients.
    let config = Config::from_env().map_err(|error| {
        eprintln!("Startup configuration error: {error}");
        io::Error::new(io::ErrorKind::InvalidInput, error)
    })?;

    // Data<T> is already Arc-backed. One registry shared across all workers.
    let services = web::Data::new(Services::new());

    log::info!("Starting API on {}:{}", config.host, config.port);

    HttpServer::new(move || {
        App::new()
            .app_data(services.clone())
            .app_data(app::json_config())
            .app_data(app::query_config())
            .app_data(app::path_config())
            .wrap(middleware::errors())
            .wrap(middleware::logger())
            .configure(app::configure_routes)
            .default_service(web::to(app::not_found))
    })
    .bind((config.host, config.port))?
    .run()
    .await
}
