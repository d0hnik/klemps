.PHONY: run-api run-frontend stop-api test-api

run-api:
	docker compose up --build api

run-frontend:
	npm --prefix client run dev -- --host 127.0.0.1 --port 5173 --strictPort

stop-api:
	docker compose stop api

test-api:
	docker compose run --rm --no-deps api cargo test --locked
