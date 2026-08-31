#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Add Mailbox script — provisions users & Maildirs inside Dovecot
# ─────────────────────────────────────────────────────────────────────────────
set -e

EMAIL=$1
PASSWORD=$2
QUOTA_GB=${3:-2}  # Default quota 2GB

if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
    echo "❌ Usage: $0 <email@domain.com> <password> [quota_gb]"
    exit 1
fi

DOMAIN=$(echo "$EMAIL" | cut -d'@' -f2)
USER_NAME=$(echo "$EMAIL" | cut -d'@' -f1)

if [ "$DOMAIN" != "sharexpress.in" ]; then
    echo "❌ Error: Mail domain must be sharexpress.in"
    exit 1
fi

USERS_FILE="/etc/dovecot/users"
touch $USERS_FILE

# Remove existing entry if any
sed -i "/^${EMAIL}:/d" $USERS_FILE

# Hash the password
HASH=$(doveadm pw -s SHA512-CRYPT -p "$PASSWORD")

# Calculate quota bytes
QUOTA_BYTES=$((QUOTA_GB * 1024 * 1024 * 1024))

# Append to dovecot users file
# Format: user@domain:hash:uid:gid::home::userdb_quota_rule=*:bytes=X
echo "${EMAIL}:${HASH}:5000:5000::/var/mail/vhosts/${DOMAIN}/${USER_NAME}::userdb_quota_rule=*:bytes=${QUOTA_BYTES}" >> $USERS_FILE
echo "✅ Added credentials to /etc/dovecot/users"

# Provision folder structure
MAIL_DIR="/var/mail/vhosts/${DOMAIN}/${USER_NAME}"
mkdir -p "$MAIL_DIR"
chown -R vmail:vmail "/var/mail/vhosts/${DOMAIN}"

# Auto subscribe default folders
doveadm mailbox create -u "$EMAIL" INBOX Sent Drafts Trash Junk Archive || true
doveadm mailbox subscribe -u "$EMAIL" INBOX Sent Drafts Trash Junk Archive || true

echo "✅ Mailbox created and subscribed successfully: $EMAIL"
