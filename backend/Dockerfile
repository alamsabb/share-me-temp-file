# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Use /tmp for Render free tier
RUN mkdir -p /tmp/uploads /app/logs

ENV NODE_ENV=production \
    UPLOAD_DIR=/tmp/uploads

USER node

CMD ["node", "dist/server.js"]
