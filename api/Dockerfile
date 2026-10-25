FROM rust:1.90.0-bookworm AS development
WORKDIR /app
EXPOSE 3000
CMD ["cargo", "run", "--locked"]

FROM development AS builder
COPY Cargo.toml Cargo.lock ./
COPY src ./src
# Optional corporate/cloud CA; ordinary local builds need no secret.
RUN --mount=type=secret,id=cargo_ca \
    if [ -f /run/secrets/cargo_ca ]; then export CARGO_HTTP_CAINFO=/run/secrets/cargo_ca; fi; \
    cargo build --release --locked

FROM debian:bookworm-slim AS runtime
WORKDIR /app
COPY --from=builder /app/target/release/klemps-api /usr/local/bin/klemps-api
USER 10001:10001
EXPOSE 3000
CMD ["klemps-api"]
