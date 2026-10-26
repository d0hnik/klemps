# Klemps

React/TypeScript frontend in `client/` and a Rust API in `api/`, kept in
one repository so they can be developed together.

## Development container

Open this repository in VS Code and run **Dev Containers: Rebuild and Reopen
in Container** (or rebuild your Codespace). Docker must be running on your
host machine when using local VS Code.

The container includes Node.js 24, npm, Rust 1.90, Cargo, Make, and the C/C++
build tools provided by the Rust image. Frontend dependencies are installed
and the Rust project is built automatically after the container is created.

Inside the container, from the repository root:

```sh
make run-frontend
```

Vite serves the frontend on port 5173, which VS Code forwards automatically.

```sh
make run-api
```

The API listens on port 3000. `api/src/main.rs` is the entry point and
`api/build.rs` remains an empty build-script starter. Database, guest sessions,
and game logic are separate follow-up tickets.

Both commands run directly inside the development container. Docker is used
by the host to build and run the development container; it is not needed
inside that container.

## API foundation

`make run-api` starts Axum on port 3000. The devcontainer forwards this port.
`GET /api/health` returns `{"status":"ok"}` without a database or guest session.

The first request follows this path:

1. `routes/health.rs` registers the endpoint and extracts `AppState`.
2. `services/health_service.rs` returns a domain health result.
3. `dto/health.rs` converts that result into the public JSON response.

`lib.rs` assembles the router and middleware. `main.rs` loads configuration,
initializes JSON logging, binds the listener, and handles Ctrl+C/SIGTERM.
Add future `routes/game.rs` and `services/game_service.rs` modules following
this pattern. Repositories and database modules will be introduced with
persistence; the health service does not need either.

Configuration is read from process environment variables (no automatic
`.env` loading):

| Variable | Default | Purpose |
| --- | --- | --- |
| `API_BIND_ADDRESS` | `0.0.0.0:3000` | IP and port to listen on |
| `API_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated exact browser origins |
| `API_BODY_LIMIT_BYTES` | `16384` | Maximum request body; range 1–1048576 |
| `API_REQUEST_TIMEOUT_SECONDS` | `10` | Handler timeout; range 1–120 |
| `RUST_LOG` | `info` | Tracing filter |

Set allowed origins explicitly for forwarded HTTPS frontend URLs or deployed
frontends. Wildcards, credentials, and URL paths are rejected. CORS permits
credentialed requests only for configured origins; this is not authentication
or authorization. Guest identity, CSRF checks for mutations, and permissions
belong to the guest/game tickets. Use HTTPS at the deployment ingress.

Errors have the shape:

```json
{"error":{"code":"not_found","message":"Route not found"}}
```

Stable codes currently include `not_found`, `method_not_allowed`,
`invalid_json`, `unsupported_media_type`, `body_too_large`, and
`request_timeout`. Future JSON handlers should use `http::json::ApiJson`
so extraction errors use the same envelope. Request logs include method,
status, and latency, excluding headers, query strings, and request bodies.
Health is a liveness check, not a database-readiness check.

```sh
cargo test --manifest-path api/Cargo.toml --locked
cargo fmt --manifest-path api/Cargo.toml --check
cargo clippy --manifest-path api/Cargo.toml --locked --all-targets -- -D warnings
```

The optional formatter/linter require `rustup component add rustfmt clippy`
once inside the devcontainer. The timeout bounds handler work until a response
is produced; streaming responses and independent background jobs need their
own limits when added.

### Registering and accessing services

`main.rs` is the composition root: create service dependencies there, register
services once, and pass application state into the router:

```rust
let services = Services::new(HealthService);
let state = AppState::new(services);
let router = app(&config, state);
```

`services/mod.rs` defines the typed `Services` registry. Each field is an
`Arc<Service>`; cloning `AppState` clones these handles and shares the same
instances. Route handlers access them through Axum state:

```rust
async fn get_health(State(state): State<AppState>) -> Json<HealthResponse> {
    Json(state.services.health_service.check().into())
}
```

When adding `GameService` or `UserService`, construct it with its required
repositories/dependencies at startup and add its typed `Arc` field to the
registry. Tests can supply their own registry to `app`. Avoid a global mutable
registry or a single mutex around all services: `Arc` provides shared ownership,
not synchronization. Add synchronization only to the particular mutable state
that requires it. Clonable connection pools can be injected directly into
services; they do not require an additional `Arc` just for sharing connections.
