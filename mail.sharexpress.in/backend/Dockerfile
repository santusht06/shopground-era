# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ─── Production Stage ────────────────────────────────────────────────────────
FROM python:3.11-slim AS runner

# Security: run as non-root user
RUN groupadd -r mailapp && useradd -r -g mailapp -d /app -s /sbin/nologin mailapp

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder --chown=mailapp:mailapp /root/.local /app/.local

# Copy source code
COPY --chown=mailapp:mailapp . /app

# Switch to non-root
USER mailapp

ENV PATH=/app/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

# Graceful shutdown with --timeout
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--timeout-keep-alive", "30"]
