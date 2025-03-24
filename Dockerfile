FROM node:18-alpine AS base

# Add build dependencies for bcrypt
RUN apk add --no-cache make gcc g++ python3 git

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Build stage
FROM base AS builder

# Install dependencies and rebuild bcrypt
RUN npm ci && npm rebuild bcrypt --build-from-source

# Copy source
COPY . .

# Build the application
RUN npm run build:client

# Test stage
FROM base AS test

# Install dependencies and rebuild bcrypt
RUN npm ci && npm rebuild bcrypt --build-from-source

# Copy source
COPY . .

# Run tests
RUN npm run test

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/knexfile.js ./
COPY --from=builder /app/src/server ./src/server

# Install production dependencies and rebuild bcrypt
RUN apk add --no-cache make gcc g++ python3 && \
    npm ci --only=production && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python3

# Add runtime dependencies for bcrypt
RUN apk add --no-cache libstdc++

EXPOSE 3000
CMD ["npm", "start"] 