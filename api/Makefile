.PHONY: dev start build test check types check-types

KLEMPS_FRONTEND_DIR ?= ../client

# Development server (debug build)
dev:
	cargo run --locked

# Release-mode server
start:
	cargo run --release --locked

build:
	cargo build --locked

test:
	cargo test --locked

check:
	cargo check --locked

types:
	typeshare src --lang=typescript --output-file "$(KLEMPS_FRONTEND_DIR)/src/api/generated/types.ts"

check-types: types
	git diff --exit-code -- "$(KLEMPS_FRONTEND_DIR)/src/api/generated/types.ts"
