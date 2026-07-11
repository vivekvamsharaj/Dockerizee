# ---------- Stage 1: Install dependencies ----------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first to leverage Docker layer caching
COPY backend/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev


# ---------- Stage 2: Build the final runtime image ----------
FROM node:20-alpine AS runner

# Set environment
ENV NODE_ENV=production

WORKDIR /app

# Create a non-root user for better container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy installed node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY backend/ .

# Ensure the non-root user owns the app directory
RUN chown -R appuser:appgroup /app

USER appuser

# The port the app listens on (overridable via PORT env var)
EXPOSE 5000

# Basic healthcheck hitting our /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-5000}/api/health || exit 1

CMD ["node", "server.js"]
