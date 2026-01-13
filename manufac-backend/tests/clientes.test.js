const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

let token;
let createdClientId;

describe('Clientes Controller', () => {

  beforeAll(async () => {
    await pool.query('DELETE FROM clientes');
    await pool.query('DELETE FROM usuarios');

    await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Admin User',
        email: 'admin@email.com',
        senha: '123456',
        papel: 'admin'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@email.com',
        senha: '123456'
      });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  /* =======================
     GET ALL CLIENTS
  ======================= */
  describe('GET /api/clientes', () => {

    test('should return all clients when authenticated', async () => {
      const res = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should fail without authentication token', async () => {
      const res = await request(app)
        .get('/api/clientes');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

  });

  /* =======================
     CREATE CLIENT
  ======================= */
  describe('POST /api/clientes', () => {

    test('should create a new client successfully', async () => {
      const res = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Client Test',
          email: 'client@test.com',
          telefone: '999999999',
          endereco: 'Street A',
          cidade: 'City',
          estado: 'ST',
          tipo: 'PF',
          cpf: '12345678901',
          observacoes: 'Test client',
          ativo: true
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nome).toBe('Client Test');

      createdClientId = res.body.id;
    });

    test('should fail to create client without authentication', async () => {
      const res = await request(app)
        .post('/api/clientes')
        .send({
          nome: 'Unauthorized Client'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

  });

  /* =======================
     UPDATE CLIENT
  ======================= */
  describe('PUT /api/clientes/:id', () => {

    test('should update a client successfully', async () => {
      const res = await request(app)
        .put(`/api/clientes/${createdClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Client Updated',
          email: 'client_updated@test.com',
          telefone: '888888888',
          endereco: 'Street B',
          cidade: 'New City',
          estado: 'NC',
          tipo: 'PF',
          cpf: '12345678901',
          observacoes: 'Updated client',
          ativo: true
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.nome).toBe('Client Updated');
    });

    test('should fail to update client without authentication', async () => {
      const res = await request(app)
        .put(`/api/clientes/${createdClientId}`)
        .send({
          nome: 'Should not update'
        });

      expect(res.statusCode).toBe(401);
    });

  });

  /* =======================
     DELETE CLIENT
  ======================= */
  describe('DELETE /api/clientes/:id', () => {

    test('should delete a client successfully', async () => {
      const res = await request(app)
        .delete(`/api/clientes/${createdClientId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Cliente deletado');
    });

    test('should fail to delete client without authentication', async () => {
      const res = await request(app)
        .delete(`/api/clientes/${createdClientId}`);

      expect(res.statusCode).toBe(401);
    });

  });

});
