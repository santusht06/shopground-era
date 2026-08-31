# =============================================================================
# mail.sharexpress.in — Makefile
# =============================================================================

.PHONY: help up down build logs restart setup dev clean

help:
	@echo ""
	@echo "  ╔══════════════════════════════════════════════════╗"
	@echo "  ║     mail.sharexpress.in — Enterprise Mail        ║"
	@echo "  ╚══════════════════════════════════════════════════╝"
	@echo ""
	@echo "  Setup:"
	@echo "    make setup          Copy .env.example → .env and build images"
	@echo "    make ssl            Generate self-signed SSL (dev) or fetch Let's Encrypt"
	@echo ""
	@echo "  Running:"
	@echo "    make up             Start all services (detached)"
	@echo "    make down           Stop all services"
	@echo "    make restart        Restart all services"
	@echo "    make logs           Tail all service logs"
	@echo "    make status         Show service status"
	@echo ""
	@echo "  Mail Management:"
	@echo "    make mailbox-add EMAIL=user@sharexpress.in PASS=secret"
	@echo "    make mailbox-remove EMAIL=user@sharexpress.in"
	@echo "    make mailbox-list   List all mailboxes"
	@echo ""
	@echo "  Dev:"
	@echo "    make dev-backend    Run FastAPI backend locally (hot-reload)"
	@echo "    make dev-frontend   Run React frontend locally (Vite dev server)"
	@echo "    make shell-backend  Open shell in backend container"
	@echo ""

# ─── Setup ────────────────────────────────────────────────────────────────────

setup:
	@[ -f .env ] || cp .env.example .env && echo "📄 Created .env from .env.example — edit it before starting!"
	@mkdir -p ssl attachments logs
	@docker compose build
	@echo "✅ Setup complete. Run 'make ssl' then 'make up'"

ssl-dev:
	@echo "🔐 Generating self-signed SSL certificates for development..."
	@mkdir -p ssl
	@openssl req -x509 -newkey rsa:4096 -keyout ssl/privkey.pem \
		-out ssl/fullchain.pem -days 365 -nodes \
		-subj "/CN=mail.sharexpress.in/O=ShareXpress/C=IN"
	@echo "✅ SSL certificates generated in ./ssl/"

ssl-prod:
	@echo "🔐 Fetching Let's Encrypt certificate for mail.sharexpress.in..."
	@docker run --rm -it \
		-p 80:80 \
		-v $(PWD)/ssl:/etc/letsencrypt/live/mail.sharexpress.in \
		certbot/certbot certonly --standalone \
		-d mail.sharexpress.in \
		-d api.mail.sharexpress.in \
		--agree-tos --non-interactive --email admin@sharexpress.in
	@echo "✅ Let's Encrypt certificate saved to ./ssl/"

# ─── Running ──────────────────────────────────────────────────────────────────

up:
	docker compose up -d
	@echo "✅ All services started"
	@echo "   Webmail:  https://mail.sharexpress.in"
	@echo "   API docs: https://api.mail.sharexpress.in/docs"
	@echo "   RabbitMQ: http://localhost:15672"

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend celery-worker

logs-mail:
	docker compose logs -f postfix dovecot

status:
	docker compose ps

build:
	docker compose build --no-cache

# ─── Mail Management ─────────────────────────────────────────────────────────

mailbox-add:
	@[ -n "$(EMAIL)" ] || (echo "Usage: make mailbox-add EMAIL=user@sharexpress.in PASS=secret" && exit 1)
	@docker exec mail-dovecot /scripts/add_mailbox.sh "$(EMAIL)" "$(PASS)"

mailbox-remove:
	@[ -n "$(EMAIL)" ] || (echo "Usage: make mailbox-remove EMAIL=user@sharexpress.in" && exit 1)
	@docker exec mail-dovecot /scripts/remove_mailbox.sh "$(EMAIL)"

mailbox-list:
	@docker exec mail-dovecot doveadm user '*'

# ─── Development ─────────────────────────────────────────────────────────────

dev-backend:
	cd backend && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm install && npm run dev

shell-backend:
	docker exec -it mail-backend /bin/bash

shell-mongodb:
	docker exec -it mail-mongodb mongosh maildb

# ─── Cleanup ──────────────────────────────────────────────────────────────────

clean:
	docker compose down -v
	@echo "🧹 All containers and volumes removed"
