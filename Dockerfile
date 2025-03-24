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

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/knexfile.js ./
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeds ./seeds

# Install production dependencies and rebuild bcrypt
RUN apk add --no-cache make gcc g++ python3 && \
    npm ci --only=production && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python3

# Add runtime dependencies for bcrypt
RUN apk add --no-cache libstdc++

# Add wait-for-it script to handle database connection
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Set environment variables
ENV PORT=10000
ENV NODE_ENV=production

EXPOSE 10000

# Use wait-for-it to ensure database is ready
CMD ["sh", "-c", "wait-for-it ${DATABASE_URL##*@} -- npm start"] 