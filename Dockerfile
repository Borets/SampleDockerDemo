# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Add a CPU-intensive task to simulate complexity 
# (generates a large file with random data and calculates hash)
RUN mkdir -p temp && \
    dd if=/dev/urandom of=temp/random_data bs=1M count=500 && \
    sha256sum temp/random_data > temp/hash.txt && \
    cat temp/hash.txt && \
    rm -rf temp

# Run linting
RUN npm run lint

# Build client-side code
RUN npm run build:client

# Run tests with coverage
RUN npm run test

# Prune dependencies for production
RUN npm prune --production

# Production stage
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/package.json ./

# Copy configuration files
COPY --from=builder /app/knexfile.js ./
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeds ./seeds

# Install additional dependencies for production
RUN apk --no-cache add dumb-init

# Add compute-intensive step in final image build
RUN for i in $(seq 1 10); do \
      echo "Simulating complex build operation: $i/10"; \
      sleep 2; \
      node -e "for(let i=0; i<1000000000; i++){}" || true; \
    done

# Use dumb-init as entrypoint to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run the application
CMD ["node", "src/server/index.js"] 