# Multi-stage build for optimized production image
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p /app/uploads && \
    mkdir -p /app/logs

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    UPLOAD_DIR=/app/uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/time', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run as non-root user for security
USER node

# Start the application
CMD ["node", "dist/server.js"]
