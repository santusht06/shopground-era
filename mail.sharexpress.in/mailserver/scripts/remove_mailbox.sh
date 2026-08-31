#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Remove Mailbox script — deletes users & Maildirs inside Dovecot
# ─────────────────────────────────────────────────────────────────────────────
set -e

EMAIL=$1

if [ -z "$EMAIL" ]; then
    echo "❌ Usage: $0 <email@domain.com>"
    exit 1
fi

DOMAIN=$(echo "$EMAIL" | cut -d'@' -f2)
USER_NAME=$(echo "$EMAIL" | cut -d'@' -f1)

USERS_FILE="/etc/dovecot/users"

if [ ! -f "$USERS_FILE" ]; then
    echo "❌ Error: /etc/dovecot/users file not found"
    exit 1
fi

# Remove entry
if grep -q "^${EMAIL}:" "$USERS_FILE"; then
    sed -i "/^${EMAIL}:/d" "$USERS_FILE"
    echo "✅ Removed credentials from /etc/dovecot/users"
else
    echo "⚠️ Warning: user $EMAIL not found in credentials"
fi

# Delete Maildir content
MAIL_DIR="/var/mail/vhosts/${DOMAIN}/${USER_NAME}"
if [ -d "$MAIL_DIR" ]; then
    rm -rf "$MAIL_DIR"
    echo "✅ Deleted mailbox directory: $MAIL_DIR"
else
    echo "⚠️ Warning: mailbox directory not found: $MAIL_DIR"
fi

echo "✅ Mailbox decommissioned successfully: $EMAIL"
# Reload dovecot passwd-file (dynamic reload, no full restart needed)
doveadm reload || true
