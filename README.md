# Task Management Application

A full-stack task management application built with modern technologies and deployed on Render.com.

## Features

- User authentication with JWT
- Task creation, reading, updating, and deletion (CRUD)
- Task prioritization and status management
- Dashboard with task statistics
- Responsive design
- Session management with Redis
- Database migrations and seeding

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL (with Knex.js for migrations and queries)
- Redis for session management
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React
- React Router for navigation
- Webpack for bundling
- CSS for styling

### DevOps & Deployment
- Docker for containerization
- Docker Compose for local development
- Render.com for cloud deployment
- GitHub Actions for CI/CD

## Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start with Docker Compose:
```bash
docker-compose up
```

The application will be available at `http://localhost:3000`

## Database Migrations

Run migrations:
```bash
npm run migrate
```

Run seeds:
```bash
npm run seed
```

## Production Deployment

The application is configured for deployment on Render.com with:
- Dockerized web service
- Managed PostgreSQL database
- Managed Redis instance

### Deployment Configuration
- Web service: Starter plan
- PostgreSQL: Basic-1GB plan with daily backups
- Redis: Standard plan with persistence

## Environment Variables

- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `SESSION_SECRET`: Secret for session management
- `JWT_SECRET`: Secret for JWT tokens
- `PORT`: Server port (default: 3000, Render: 10000)

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Login user
- `POST /api/auth/logout`: Logout user

### Tasks
- `GET /api/tasks`: List all tasks
- `POST /api/tasks`: Create new task
- `GET /api/tasks/:id`: Get task details
- `PUT /api/tasks/:id`: Update task
- `DELETE /api/tasks/:id`: Delete task

### User
- `GET /api/users/me`: Get current user info

## Testing

Run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 