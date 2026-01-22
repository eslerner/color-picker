.PHONY: run lint format

run:
	npm run dev

lint:
	npm run lint

format:
	npx prettier --write .
