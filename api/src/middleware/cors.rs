use actix_cors::Cors;
use actix_web::http::{Method, header};

pub fn cors(allowed_origins: &[String]) -> Cors {
    let mut cors = Cors::default()
        .block_on_origin_mismatch(true)
        .allowed_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allowed_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
        .max_age(3600);

    for origin in allowed_origins {
        cors = cors.allowed_origin(origin);
    }

    cors
}
