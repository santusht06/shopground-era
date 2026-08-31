#!/bin/bash
# =============================================================================
# Postfix + OpenDKIM Production Entrypoint
# Generates DKIM keys on first run, starts OpenDKIM milter, then Postfix
# =============================================================================
set -e

DOMAIN="${MAIL_DOMAIN:-sharexpress.in}"
DKIM_SELECTOR="mail"
DKIM_KEY_DIR="/etc/opendkim/keys/${DOMAIN}"
DKIM_PRIVATE_KEY="${DKIM_KEY_DIR}/${DKIM_SELECTOR}.private"
DKIM_PUBLIC_KEY="${DKIM_KEY_DIR}/${DKIM_SELECTOR}.txt"

echo "════════════════════════════════════════════════════════════════"
echo " mail.sharexpress.in — Postfix + OpenDKIM Startup"
echo "════════════════════════════════════════════════════════════════"

# ─── 1. SSL Certificate Setup ─────────────────────────────────────────────────
if [ ! -f /etc/postfix/ssl/fullchain.pem ] || [ ! -f /etc/postfix/ssl/privkey.pem ]; then
    echo "🔐 [SSL] No certificates found. Generating self-signed TLS certs..."
    mkdir -p /etc/postfix/ssl
    openssl req -x509 -newkey rsa:4096 \
        -keyout /etc/postfix/ssl/privkey.pem \
        -out /etc/postfix/ssl/fullchain.pem \
        -days 3650 -nodes \
        -subj "/CN=${MAIL_HOSTNAME:-mail.sharexpress.in}/O=ShareXpress/C=IN" \
        -addext "subjectAltName=DNS:${MAIL_HOSTNAME:-mail.sharexpress.in},DNS:${DOMAIN}"
    chmod 600 /etc/postfix/ssl/privkey.pem
    chmod 644 /etc/postfix/ssl/fullchain.pem
    echo "✅ [SSL] Self-signed TLS certs generated (valid 10 years)."
    echo "   ⚠️  Replace with Let's Encrypt certs before going live!"
else
    echo "✅ [SSL] TLS certificates found."
fi

# ─── 2. OpenDKIM Key Generation ───────────────────────────────────────────────
mkdir -p "${DKIM_KEY_DIR}"
chown -R opendkim:opendkim /etc/opendkim/keys

if [ ! -f "${DKIM_PRIVATE_KEY}" ]; then
    echo "🔑 [DKIM] No DKIM key found. Generating RSA-2048 DKIM keypair..."
    opendkim-genkey \
        --domain="${DOMAIN}" \
        --selector="${DKIM_SELECTOR}" \
        --bits=2048 \
        --directory="${DKIM_KEY_DIR}"
    chown opendkim:opendkim "${DKIM_PRIVATE_KEY}" "${DKIM_PUBLIC_KEY}"
    chmod 600 "${DKIM_PRIVATE_KEY}"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo " ✅ [DKIM] Keys generated! Add this TXT record to your DNS:"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "  Record Name:  ${DKIM_SELECTOR}._domainkey.${DOMAIN}"
    echo "  Record Type:  TXT"
    echo "  Record Value: $(cat ${DKIM_PUBLIC_KEY} | grep -o '".*"' | tr -d '\n' | tr -d '"' )"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo ""
else
    echo "✅ [DKIM] DKIM keypair already exists for selector '${DKIM_SELECTOR}'."
    echo "   Public key DNS record (${DKIM_SELECTOR}._domainkey.${DOMAIN}):"
    echo "   $(cat ${DKIM_PUBLIC_KEY} | grep -o '".*"' | tr -d '\n' | tr -d '"')"
fi

# ─── 3. Start OpenDKIM Milter ─────────────────────────────────────────────────
echo "▶ [OpenDKIM] Starting milter daemon..."
mkdir -p /var/run/opendkim
chown opendkim:opendkim /var/run/opendkim

# Copy OpenDKIM config
cp /etc/opendkim/custom/opendkim.conf /etc/opendkim/opendkim.conf
cp /etc/opendkim/custom/keytable /etc/opendkim/keytable
cp /etc/opendkim/custom/signingtable /etc/opendkim/signingtable
cp /etc/opendkim/custom/trustedhosts /etc/opendkim/trustedhosts

# Set ownership of the copied configuration files & directories
chown opendkim:opendkim /etc/opendkim/opendkim.conf /etc/opendkim/keytable /etc/opendkim/signingtable /etc/opendkim/trustedhosts
chmod 644 /etc/opendkim/opendkim.conf /etc/opendkim/keytable /etc/opendkim/signingtable /etc/opendkim/trustedhosts

opendkim -x /etc/opendkim/opendkim.conf
echo "✅ [OpenDKIM] Milter running on inet:12301@localhost"

# Wait for milter to be ready
sleep 2

# ─── 4. Postfix Configuration ─────────────────────────────────────────────────
echo "▶ [Postfix] Applying configuration..."

cp /etc/postfix/custom/main.cf /etc/postfix/main.cf
cp /etc/postfix/custom/master.cf /etc/postfix/master.cf

# Copy virtual mailboxes and alias lists (loaded as texthash in main.cf)
echo "📦 [Postfix] Rebuilding virtual mailbox & alias maps..."
cp /etc/postfix/custom/virtual_mailboxes /etc/postfix/virtual_mailboxes
cp /etc/postfix/custom/virtual_alias /etc/postfix/virtual_alias
cp /etc/postfix/custom/smtp_header_checks /etc/postfix/smtp_header_checks

# Fix permissions
chown -R root:postfix /var/mail/vhosts 2>/dev/null || true
chmod -R 770 /var/mail/vhosts 2>/dev/null || true

# ─── 5. Postfix Queue Tuning ──────────────────────────────────────────────────
postconf -e "default_process_limit=100"
postconf -e "smtp_destination_concurrency_limit=10"
postconf -e "smtp_destination_rate_delay=0"
postconf -e "maximal_queue_lifetime=5d"
postconf -e "bounce_queue_lifetime=1d"
postconf -e "qmgr_message_recipient_limit=1000"

echo "✅ [Postfix] Configuration applied."

# ─── 6. Start Postfix ─────────────────────────────────────────────────────────
echo "▶ [Postfix] Starting in foreground mode..."
echo ""
echo "════════════════════════════════════════════════════════════════"
echo " ✅ mail.sharexpress.in is LIVE"
echo "    SMTP:  Port 25 (incoming)  /  587 (submission)"
echo "    DKIM:  RSA-2048 signed, selector '${DKIM_SELECTOR}'"
echo "    TLS:   TLSv1.2/TLSv1.3 enforced"
echo "════════════════════════════════════════════════════════════════"

exec postfix start-fg
