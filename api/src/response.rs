/// Implements Actix Responder for a serializable DTO, so handlers can return
/// the DTO directly: `async fn check(...) -> HealthResponse { ... }`.
#[macro_export]
macro_rules! impl_json_responder {
    ($response:ty) => {
        impl actix_web::Responder for $response {
            type Body = actix_web::body::BoxBody;

            fn respond_to(
                self,
                _request: &actix_web::HttpRequest,
            ) -> actix_web::HttpResponse<Self::Body> {
                actix_web::HttpResponse::Ok().json(self)
            }
        }
    };
}
