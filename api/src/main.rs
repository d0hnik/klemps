use std::{io, sync::Arc};

use actix_web::{web, App, HttpServer};
use klemps_api::{middleware, routes::health::health_routes, state::Services};

#[actix_web::main]
async fn main() -> io::Result<()> {
    env_logger::init_from_env(
        env_logger::Env::default().default_filter_or("info,actix_web=info"),
    );

    let services = web::Data::from(Arc::new(Services::new()));
    let bind_addr = std::env::var("BIND_ADDR")
        .unwrap_or_else(|_| "127.0.0.1:3000".to_owned());

    HttpServer::new(move || {
        App::new()
            .app_data(services.clone())
            .wrap(middleware::logger())
            .service(
                web::scope("/api")
                    .service(
                        web::scope("/v1")
                            .service(health_routes()),
                    ),
            )
    })
    .bind(&bind_addr)?
    .run()
    .await
}
