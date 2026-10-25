# Klemps

Irish Poker game with a React/TypeScript frontend and a Rust/Axum API.

Both live in this repository: `client/` contains the frontend and `api/`
contains the backend. This keeps changes to the game and its API together.
They can still be built and hosted as separate services; a separate Git
repository is not needed for separate deployment.

## Development

Requires Docker Engine with Docker Compose v2, Make, and Node.js 24 with npm.
Rust runs inside Docker, so a host Rust installation is optional.

### VS Code Dev Containers / GitHub Codespaces

The `.devcontainer/` configuration provides Node.js 24, npm, Make, and a
Docker daemon inside the development container. The Docker-in-Docker feature
uses a privileged development container; Docker must be available on the
host (Docker Desktop on macOS/Windows), or supplied by Codespaces.

After pulling these files, run **Dev Containers: Rebuild Container** in VS
Code, or rebuild the Codespace. Simply reopening the terminal does not install
the missing tools. Frontend dependencies are installed automatically after
creation. Then run `make run-api` and `make run-frontend` in separate terminals.
Ports 3000 and 5173 are forwarded to your machine.

### Without a devcontainer

Install the frontend dependencies once from the repository root:

```sh
npm ci
npm --prefix client ci
```

Run these in separate terminals from the repository root:

```sh
make run-api
```

```sh
make run-frontend
```

The API listens on port 3000; Vite listens on port 5173. Both are bound to
localhost for development. Check the API with:

```sh
curl --fail http://127.0.0.1:3000/api/health
# {"status":"ok"}
```

`make run-api` builds the development image and compiles the mounted Rust
source. Cargo downloads and build outputs are cached in Docker volumes.
After changing Rust code, restart with `docker compose restart api` to
recompile; automatic file watching is not enabled. Stop the API with Ctrl+C
or `make stop-api`. `docker compose down` removes the development container
and network while retaining the caches.

## Checks

```sh
make test-api
npm --prefix client test -- --run
npm --prefix client run build
npm --prefix client run lint
```

The frontend currently has existing build/lint errors in
`client/src/entities/newGuess.ts` (an incomplete, unused guess-function map).

## Backend deployment image

The Dockerfile also provides a release build with a small, non-root runtime
image, separate from the development container:

```sh
docker build --target runtime -t klemps-api ./api
docker run --rm -p 127.0.0.1:3000:3000 klemps-api
```

Frontend production assets are built separately with
`npm --prefix client run build` once the existing TypeScript errors are fixed.
Hosting, domains, TLS, and frontend-to-API integration can be configured when
the application is ready for deployment.
