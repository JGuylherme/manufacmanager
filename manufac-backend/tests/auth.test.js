const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Auth Controller', () => {

  beforeAll(async () => {
    await pool.query('DELETE FROM usuarios');
  });

  afterAll(async () => {
    await pool.end();
  });

  /* =======================
     REGISTER TESTS
  ======================= */
  describe('POST /api/auth/register', () => {

    test('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Test User',
          email: 'test@email.com',
          senha: '123456',
          papel: 'admin'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@email.com');
    });

    test('should not allow duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Another User',
          email: 'test@email.com',
          senha: '123456',
          papel: 'admin'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should fail when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'missing@email.com'
        });

      expect(res.statusCode).toBe(500); 
    });

  });

  /* =======================
     LOGIN TESTS
  ======================= */
  describe('POST /api/auth/login', () => {

    test('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@email.com',
          senha: '123456'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@email.com');
    });

    test('should fail when email does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@email.com',
          senha: '123456'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should fail when password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@email.com',
          senha: 'wrongpassword'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should fail when email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@email.com'
        });

      expect(res.statusCode).toBe(500);
    });

    /* =======================
       JWT VALIDATION TEST
    ======================= */
    test('should return a valid JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@email.com',
          senha: '123456'
        });

      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('email', 'test@email.com');
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('papel');
    });

    /* =======================
       PERFORMANCE TEST
    ======================= */
    test('should respond within 500ms', async () => {
      const start = Date.now();

      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@email.com',
          senha: '123456'
        });

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500);
    });

  });

});
