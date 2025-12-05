# n8n Service Dockerfile
FROM n8nio/n8n:latest

# Set environment variables
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV GENERIC_TIMEZONE=America/Mexico_City

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5678/healthz || exit 1

EXPOSE 5678

CMD ["n8n", "start"]
