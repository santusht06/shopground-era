#!/bin/bash
set -e

echo "🚀 Starting Dovecot..."

# Copy custom configs to /etc/dovecot
cp /etc/dovecot/custom/dovecot.conf /etc/dovecot/dovecot.conf
cp /etc/dovecot/custom/10-auth.conf /etc/dovecot/10-auth.conf
cp /etc/dovecot/custom/10-mail.conf /etc/dovecot/10-mail.conf
cp /etc/dovecot/custom/10-ssl.conf /etc/dovecot/10-ssl.conf
cp /etc/dovecot/custom/10-master.conf /etc/dovecot/10-master.conf

# Ensure SSL files exist, generate fallback if not
if [ ! -f /etc/dovecot/ssl/fullchain.pem ] || [ ! -f /etc/dovecot/ssl/privkey.pem ]; then
    echo "🔐 SSL certs missing. Generating temporary self-signed TLS certs..."
    mkdir -p /etc/dovecot/ssl
    openssl req -x509 -newkey rsa:4096 \
        -keyout /etc/dovecot/ssl/privkey.pem \
        -out /etc/dovecot/ssl/fullchain.pem \
        -days 365 -nodes \
        -subj "/CN=mail.sharexpress.in/O=ShareXpress/C=IN"
    chmod 600 /etc/dovecot/ssl/privkey.pem
    echo "✅ Self-signed SSL certs generated."
fi

# Ensure mail directory permissions are correct
chown -R vmail:vmail /var/mail/vhosts
chmod 770 /var/mail/vhosts


# Initialize dovecot virtual users file
touch /etc/dovecot/users
chown dovecot:dovecot /etc/dovecot/users
chmod 600 /etc/dovecot/users

# Seed default mailboxes (idempotent, skip if already exists)
bash /scripts/add_mailbox.sh "santusht@sharexpress.in" "${ADMIN_PASSWORD:-AdminPass123!}" 10 || true
bash /scripts/add_mailbox.sh "support@sharexpress.in" "SupportPass123!" 2 || true
bash /scripts/add_mailbox.sh "hr@sharexpress.in" "HRPass123!" 2 || true
bash /scripts/add_mailbox.sh "noreply@sharexpress.in" "NoreplyPass123!" 1 || true

echo "✅ Dovecot configuration applied. Starting..."

# Start Dovecot in foreground
exec dovecot -F
