pub mod cors;
pub mod errors;
pub mod rate_limit;

use actix_web::middleware::Logger;

pub fn logger() -> Logger {
    Logger::default()
}
