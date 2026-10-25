# Klemps

React/TypeScript frontend in `client/` and a Rust starter in `api/`, kept in
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

The Rust starter prints `Klemps backend` and exits. `api/src/main.rs` is the
entry point. `api/build.rs` is an empty Cargo build script ready for future
build steps. No HTTP server, database, or game logic is implemented yet.

Both commands run directly inside the development container. Docker is used
by the host to build and run the development container; it is not needed
inside that container.
