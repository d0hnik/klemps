.PHONY: run-api run-frontend build-api check-api test-api lint-api fmt-check-api types check-types test

# Relative to api/, matching the build script's frontend path setting.
KLEMPS_FRONTEND_DIR ?= ../client

run-api:
	cargo run --manifest-path api/Cargo.toml --locked

run-frontend:
	npm --prefix client run dev -- --host 0.0.0.0 --port 5173 --strictPort

test:
	make test-api

test-api:
	cargo test --manifest-path api/Cargo.toml --locked

build-api:
	cargo build --manifest-path api/Cargo.toml --locked

check-api:
	cargo check --manifest-path api/Cargo.toml --locked

lint-api:
	cargo clippy --manifest-path api/Cargo.toml --locked --all-targets -- -D warnings

fmt-check-api:
	cargo fmt --manifest-path api/Cargo.toml --check

types:
	cd api && typeshare src --lang=typescript --output-file "$(KLEMPS_FRONTEND_DIR)/src/api/generated/types.ts"

check-types: types
	git -C api diff --exit-code -- "$(KLEMPS_FRONTEND_DIR)/src/api/generated/types.ts"
