.PHONY: run-api run-frontend test-api

run-api:
	cargo run --manifest-path api/Cargo.toml --locked

run-frontend:
	npm --prefix client run dev -- --host 0.0.0.0 --port 5173 --strictPort

test-api:
	cd api && cargo test