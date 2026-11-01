use std::io;

use actix_web::{App, HttpServer, middleware::Logger, web::{self, Data}};
use env_logger::{Env, init_from_env};
use klemps_api::{routes::health::health_routes, state::Services};

#[actix_web::main]
async fn main() -> io::Result<()> {
    init_from_env(Env::default().default_filter_or("info"));

    let services = Data::new(Services::new());

    HttpServer::new(move || {
        App::new()
            .app_data(services.clone())
            .wrap(Logger::default())
            .service(
                web::scope("/api")
                    .service(web::scope("/v1").service(health_routes())),
            )
    })
    .bind(("127.0.0.1", 3000))?
    .run()
    .await
}
