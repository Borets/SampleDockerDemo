const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Mock bcrypt and jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../db');

// Mock implementations
bcrypt.hash.mockResolvedValue('hashed-password');
bcrypt.compare.mockResolvedValue(true);
jwt.sign.mockReturnValue('mock-token');

const app = express();
app.use(express.json());
app.use('/api/auth', require('../routes/auth'));

describe('Authentication Routes', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset database mock
    db.mockClear();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'password123'
      };

      db().insert.mockResolvedValueOnce([{ id: 1 }]);
      db().where.mockResolvedValueOnce([]);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', 'mock-token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 409 if user already exists', async () => {
      db().where.mockResolvedValueOnce([{ id: 1 }]);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password'
      };

      db().where.mockResolvedValueOnce([mockUser]);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mock-token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password'
      };

      db().where.mockResolvedValueOnce([mockUser]);
      bcrypt.compare.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 if user does not exist', async () => {
      db().where.mockResolvedValueOnce([]);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
}); 