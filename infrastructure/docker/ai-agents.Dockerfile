# AI Agents Service Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY ai-agents/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY ai-agents/src ./src

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["node", "src/index.js"]
