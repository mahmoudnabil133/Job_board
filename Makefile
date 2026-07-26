.PHONY: dev dev-down test lint build push deploy setup-server server-shell server-logs server-migrate

DEPLOY_HOST = 3.90.150.15
DEPLOY_USER = ubuntu

# ─── Development ────────────────────────────────────────────

dev:
	docker compose up -d

dev-down:
	docker compose down

dev-build:
	docker compose up -d --build

test:
	docker compose exec backend php artisan test

lint:
	cd web && npm run lint

# ─── Production Build ───────────────────────────────────────

build:
	docker compose -f docker-compose.prod.yml build

push:
	docker compose -f docker-compose.prod.yml push

# ─── Deploy ─────────────────────────────────────────────────

deploy: build push
	ssh -i ~/Downloads/test_apps.pem $(DEPLOY_USER)@$(DEPLOY_HOST) "\
		cd /opt/hireitian && \
		docker compose -f docker-compose.prod.yml pull && \
		docker compose -f docker-compose.prod.yml up -d --remove-orphans && \
		docker compose exec backend php artisan migrate --force && \
		docker compose exec backend php artisan config:cache && \
		docker compose exec backend php artisan route:cache"

# ─── Server Setup (run once on fresh Ubuntu) ────────────────

setup-server:
	ssh -i ~/Downloads/test_apps.pem $(DEPLOY_USER)@$(DEPLOY_HOST) 'bash -s' < scripts/setup-server.sh

# ─── Server Management ──────────────────────────────────────

server-shell:
	ssh -i ~/Downloads/test_apps.pem $(DEPLOY_USER)@$(DEPLOY_HOST) "cd /opt/hireitian && bash"

server-logs:
	ssh -i ~/Downloads/test_apps.pem $(DEPLOY_USER)@$(DEPLOY_HOST) "cd /opt/hireitian && docker compose -f docker-compose.prod.yml logs -f --tail=100"

server-migrate:
	ssh -i ~/Downloads/test_apps.pem $(DEPLOY_USER)@$(DEPLOY_HOST) "cd /opt/hireitian && docker compose -f docker-compose.prod.yml exec -T backend php artisan migrate --force"

server-status:
	ssh -i ~/Downloads/test_apps.pem $(DEPLOY_USER)@$(DEPLOY_HOST) "cd /opt/hireitian && docker compose -f docker-compose.prod.yml ps"
