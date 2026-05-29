# Makefile – one‑command build & run for Job_board project
# -------------------------------------------------------------
# Usage:
#   make deploy      # copies .env files, builds images, starts containers,
#                     # installs PHP & Node dependencies, generates app key,
#                     # runs migrations & seeders.
#   make clean       # stops containers and removes images/volumes.

.PHONY: copy-env build up install-deps key migrate seed serve web-dev clean deploy

# ---------- Helper targets ----------
copy-env:
	@echo "📄 Copying .env.example → .env (if not already present)"
	@cp -n api/.env.example api/.env || true
	@cp -n web/.env.example web/.env || true

build:
	@echo "🔧 Building Docker images"
	docker compose build

up:
	@echo "🚀 Starting containers in background"
	docker compose up -d

install-deps:
	@echo "📦 Installing PHP & Node dependencies"
	docker compose exec api composer install --no-interaction --prefer-dist
	docker compose exec web npm ci

key:
	@echo "🔑 Generating Laravel application key"
	docker compose exec api php artisan key:generate --force

migrate:
	@echo "🗂️ Running migrations"
	docker compose exec api php artisan migrate --force

seed:
	@echo "🌱 Seeding database"
	docker compose exec api php artisan db:seed --force

serve:
	@echo "🖥️  Starting Laravel dev server"
	docker compose exec api php artisan serve --host=0.0.0.0 --port=8000

web-dev:
	@echo "⚡️  Starting Vite dev server"
	docker compose exec web npm run dev

clean:
	@echo "🧹 Stopping containers and removing resources"
	docker compose down -v --rmi all

# ---------- One‑command deployment ----------
# This target runs everything in the correct order.
# It is safe to re‑run; copy‑env will not overwrite existing .env files.
deploy: copy-env build up install-deps key migrate seed
	@echo "✅ Deployment complete – API listening on http://localhost:8000, Vite on http://localhost:3000"
