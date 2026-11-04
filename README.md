# Klemps

React/TypeScript frontend in `client/` and an Actix Web API in `api/`, kept in
one repository so they can be developed together.

## Development container

Open this repository in VS Code and run **Dev Containers: Rebuild and Reopen
in Container** (or rebuild your Codespace). Docker must be running on your
host machine when using local VS Code.

The container includes Node.js 24, npm, Rust 1.90, Cargo, Make, Typeshare 1.13.4,
and the C/C++ build tools provided by the Rust image. Frontend dependencies are
installed and the Rust project is built automatically after the container is created.

Inside the container, from the repository root:

```sh
make run-frontend
```

Vite serves the frontend on port 5173, which VS Code forwards automatically.

```sh
make run-api
```

The API listens on `127.0.0.1:3000`. `GET /api/health` returns
`{"status":"ok"}`. Versioned endpoints belong under `/api/v1`; game logic,
multiplayer, accounts, and a database are not implemented yet.

Runtime settings are documented in [api/.env.example](api/.env.example).
Export them in your shell before starting the API; `.env` files are not loaded
automatically. `HOST=0.0.0.0` allows access through a container's published port.
Set `CORS_ALLOWED_ORIGINS` to the exact frontend origins you use. Disallowed
browser origins are rejected, but CORS does not authenticate players.

The `/api/v1` rate limit is shared across workers within one process. The store
holds at most 10,000 client IPs and removes inactive entries on the first request
after each cleanup window. At capacity, new IPs receive HTTP 429 until space is
available; active clients keep their existing limits. `/api/health` is exempt.
Client IPs come from the socket peer, so a reverse proxy would share one limit
unless trusted-proxy handling is added. Multiple API processes have separate stores.

Both commands run directly inside the development container. Docker is used
by the host to build and run the development container; it is not needed
inside that container.

## Shared API types

Add `#[typeshare]` to Rust API structs and enums. `api/build.rs` generates
`client/src/api/generated/types.ts` during backend builds. Do not edit that file
by hand. Typeshare emits TypeScript enums, which the frontend compiler allows.

To regenerate explicitly, including after restoring or deleting the output:

```sh
make types
```

`make check-types` regenerates the file and fails if it differs from the
committed version. CI runs this check alongside Rust formatting, Clippy, backend
tests, and the frontend build, lint, and tests.

Outside the dev container, install the same generator version:

```sh
cargo install typeshare-cli --version 1.13.4 --locked
```

Set `KLEMPS_FRONTEND_DIR` at build time to use another frontend directory, or
`KLEMPS_SKIP_TS_GENERATION=1` for backend-only builds without the frontend or
generator. Committed types still need to pass the generation check before merging.

## Backend checks

Run these commands from the repository root using the root Makefile:

```sh
make test-api
make fmt-check-api
make lint-api
```
