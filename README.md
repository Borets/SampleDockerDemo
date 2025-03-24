# Build Performance Demo

A medium-complexity sample application designed to evaluate build performance across different platforms (Render.com, Heroku, GitHub Actions, etc.)

## Features

- Full-stack JavaScript application with Express and React
- PostgreSQL database integration with Knex.js for migrations and queries
- Redis for session management and caching
- Authentication with JWT tokens
- CRUD operations for task management
- Unit and integration tests
- Docker configuration with multi-stage builds
- Platform-specific configuration files

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** React
- **Database:** PostgreSQL
- **Cache:** Redis
- **Authentication:** JWT, bcrypt
- **Testing:** Jest, Supertest
- **Build Tools:** Docker, Webpack
- **Languages:** JavaScript, HTML, CSS

## Local Development

### Prerequisites

- Node.js v18+
- Docker and Docker Compose
- PostgreSQL (local or Docker)
- Redis (local or Docker)

### Setup with Docker Compose (recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/build-performance-demo.git
cd build-performance-demo

# Start all services
docker-compose up -d

# The application will be available at http://localhost:3000
```

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/build-performance-demo.git
cd build-performance-demo

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database and Redis URLs

# Run migrations
npm run migrate

# Seed the database (optional)
npm run seed

# Start development server
npm run dev

# The application will be available at http://localhost:3000
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Deployment

### Render.com

This application includes a `render.yaml` file for easy deployment to Render.com. 

1. Push your code to GitHub
2. In Render.com dashboard, choose "Blueprint"
3. Connect to your GitHub repo
4. Render will automatically deploy the web service, PostgreSQL database, and Redis instance

### Heroku

This application includes Heroku configuration files.

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis addon
heroku addons:create heroku-redis:hobby-dev

# Deploy to Heroku
git push heroku main

# Run migrations
heroku run npm run migrate
```

### GitHub Actions

The included GitHub Actions workflow in `.github/workflows/ci.yml` will:

1. Run tests on every push and pull request
2. Build and push a Docker image to GitHub Container Registry on merges to main

## Build Performance Evaluation

This application is specifically designed to have a moderately complex build process that can be used to evaluate performance across different platforms:

- Multi-stage Docker build
- Webpack bundling with optimization
- Comprehensive test suite
- Artificial computational tasks to extend build time

When benchmarking, consider measuring:

- Total build time
- Time for specific stages (dependencies, tests, bundling)
- Resource utilization (CPU, memory)
- Cache effectiveness
- Build logs for insights 