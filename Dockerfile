FROM node:18-alpine AS base

# Add build dependencies for bcrypt
RUN apk add --no-cache make gcc g++ python3 git

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build stage
FROM base AS builder
RUN npm run build

# Test stage
FROM base AS test
RUN npm run test

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/knexfile.js ./

# Install production dependencies only
RUN npm ci --only=production

# Add runtime dependencies for bcrypt
RUN apk add --no-cache libstdc++

EXPOSE 3000
CMD ["npm", "start"] 