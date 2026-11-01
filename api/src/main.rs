use std::io;

use actix_web::{web, App, HttpServer};
use klemps_api::{app, config::Config, middleware, state::Services};

#[actix_web::main]
async fn main() -> io::Result<()> {
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    let config = Config::from_env().map_err(|error| {
        eprintln!("Startup configuration error: {error}");
        io::Error::new(io::ErrorKind::InvalidInput, error)
    })?;

    let bind_addr = (config.host, config.port);
    let services = web::Data::new(Services::new());
    // Create once, outside the worker closure: workers in this process share limits.
    let limiter_store = middleware::rate_limit::new_store();
    log::info!("Starting API on {}:{}", config.host, config.port);

    HttpServer::new(move || {
        App::new()
            .app_data(services.clone())
            .app_data(app::json_config())
            .app_data(app::query_config())
            .app_data(app::path_config())
            .wrap(middleware::cors::cors(&config.cors_allowed_origins))
            // Outer error handler converts Actix/CORS errors to the same envelope.
            .wrap(middleware::errors::errors())
            .wrap(middleware::logger())
            .configure(|cfg| {
                app::configure_routes(cfg, limiter_store.clone(), &config.rate_limit)
            })
            .default_service(web::to(app::not_found))
    })
    .bind(bind_addr)?
    .run()
    .await
}
