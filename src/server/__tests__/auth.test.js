const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const { generateToken } = require('../middleware/auth');
const { db } = require('../db');
const bcrypt = require('bcrypt');

// Mock dependencies
jest.mock('../db', () => ({
  db: {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn().mockReturnValue([1]),
    returning: jest.fn().mockReturnThis(),
  },
}));

jest.mock('../middleware/auth', () => ({
  generateToken: jest.fn().mockReturnValue('mock-token'),
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock user doesn't exist yet
      db.where.mockImplementation(() => ({
        first: jest.fn().mockResolvedValue(null),
      }));
      
      // Mock user insertion
      db.insert.mockImplementation(() => ({
        returning: jest.fn().mockResolvedValue([1]),
      }));
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', 'mock-token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      
      // Verify bcrypt was called
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      
      // Verify token generation
      expect(generateToken).toHaveBeenCalled();
    });
    
    it('should return 409 if user already exists', async () => {
      // Mock user already exists
      db.where.mockImplementation(() => ({
        first: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
      }));
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
    
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          // Missing email and password
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'All fields are required');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Mock user exists
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed-password',
        role: 'user',
      };
      
      db.where.mockImplementation(() => ({
        first: jest.fn().mockResolvedValue(mockUser),
      }));
      
      // Mock password matches
      bcrypt.compare.mockResolvedValue(true);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mock-token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 1);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      
      // Verify password was compared
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      
      // Verify token generation
      expect(generateToken).toHaveBeenCalledWith(mockUser);
    });
    
    it('should return 401 if password is incorrect', async () => {
      // Mock user exists
      db.where.mockImplementation(() => ({
        first: jest.fn().mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password: 'hashed-password',
        }),
      }));
      
      // Mock password doesn't match
      bcrypt.compare.mockResolvedValue(false);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong-password',
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
    
    it('should return 401 if user does not exist', async () => {
      // Mock user doesn't exist
      db.where.mockImplementation(() => ({
        first: jest.fn().mockResolvedValue(null),
      }));
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
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
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });
}); 