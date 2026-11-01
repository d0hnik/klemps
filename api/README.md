# Klemps API (Actix Web)

A minimal Actix Web REST API with top-level `routes/`, `services/`, `domain/`, and `dto/` directories. Each directory's `mod.rs` only declares modules. The shared `Services` registry lives in `src/state.rs`, not in `src/services/mod.rs`.

## Run

```sh
cargo run
curl http://127.0.0.1:3000/api/v1/health
```

Expected response: `{"status":"ok"}`.

For a containerized deployment use `BIND_ADDR=0.0.0.0:3000`.

## Test

```sh
cargo test
```

## Code organization

- `src/state.rs`: central `Services` registry, shared as `web::Data<Services>` (backed by `Arc`).
- `src/services/mod.rs`: only `pub mod health_service;`, and later other service modules.
- `src/services/health_service.rs`: health-check implementation.
- `src/routes/health.rs`: `#[get("/health")]` handler plus `health_routes() -> Scope`.
- `src/domain/health.rs`: domain type.
- `src/dto/health.rs`: public JSON response DTO.
- `src/main.rs`: startup, middleware, shared services, `/api/v1` scopes.

The health endpoint is a **liveness** check; database readiness can be a separate endpoint once Supabase is configured.
