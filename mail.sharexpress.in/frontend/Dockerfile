# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
# Set build arguments for API URLs
ARG VITE_API_URL=https://api.mail.sharexpress.in/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Production Stage ────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy static builds
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx server to support client-side routing fallback
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
