const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

let token;
let createdFornecedorId;

describe('Fornecedores Controller', () => {

  beforeAll(async () => {
    await pool.query('DELETE FROM fornecedores');
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
     GET ALL FORNECEDORES
  ======================= */
  describe('GET /api/fornecedores', () => {

    test('should return all suppliers when authenticated', async () => {
      const res = await request(app)
        .get('/api/fornecedores')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should fail without authentication token', async () => {
      const res = await request(app)
        .get('/api/fornecedores');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

  });

  /* =======================
     CREATE FORNECEDOR
  ======================= */
  describe('POST /api/fornecedores', () => {

    test('should create a new supplier successfully', async () => {
      const res = await request(app)
        .post('/api/fornecedores')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Supplier Test',
          email: 'supplier@test.com',
          telefone: '999999999',
          tipo: 'PJ',
          cnpj: '12345678000199',
          endereco: 'Street A',
          cidade: 'City',
          estado: 'ST',
          contato_responsavel: 'John Doe',
          observacoes: 'Test supplier',
          ativo: true
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nome).toBe('Supplier Test');

      createdFornecedorId = res.body.id;
    });

    test('should fail to create supplier without authentication', async () => {
      const res = await request(app)
        .post('/api/fornecedores')
        .send({
          nome: 'Unauthorized Supplier'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

  });

  /* =======================
     UPDATE FORNECEDOR
  ======================= */
  describe('PUT /api/fornecedores/:id', () => {

    test('should update a supplier successfully', async () => {
      const res = await request(app)
        .put(`/api/fornecedores/${createdFornecedorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Supplier Updated',
          email: 'supplier_updated@test.com',
          telefone: '888888888',
          tipo: 'PJ',
          cnpj: '12345678000199',
          endereco: 'Street B',
          cidade: 'New City',
          estado: 'NC',
          contato_responsavel: 'Jane Doe',
          observacoes: 'Updated supplier',
          ativo: false
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.nome).toBe('Supplier Updated');
      expect(res.body.ativo).toBe(false);
    });

    test('should fail to update supplier without authentication', async () => {
      const res = await request(app)
        .put(`/api/fornecedores/${createdFornecedorId}`)
        .send({
          nome: 'Should not update'
        });

      expect(res.statusCode).toBe(401);
    });

  });

  /* =======================
     DELETE FORNECEDOR
  ======================= */
  describe('DELETE /api/fornecedores/:id', () => {

    test('should delete a supplier successfully', async () => {
      const res = await request(app)
        .delete(`/api/fornecedores/${createdFornecedorId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Fornecedor deletado');
    });

    test('should fail to delete supplier without authentication', async () => {
      const res = await request(app)
        .delete(`/api/fornecedores/${createdFornecedorId}`);

      expect(res.statusCode).toBe(401);
    });

  });

});
