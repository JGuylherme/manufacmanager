const { faker } = require('@faker-js/faker');
const pool = require('../config/db');

async function seed() {
  try {
    await pool.query('DELETE FROM producao');
    await pool.query('DELETE FROM pedidos');
    await pool.query('DELETE FROM entradas_saida_estoque   ');
    await pool.query('DELETE FROM produtos');
    await pool.query('DELETE FROM fornecedores');
    await pool.query('DELETE FROM clientes');

    const clientes = [];
    for (let i = 0; i < 10; i++) {
      const nome = faker.person.fullName();
      const email = faker.internet.email();
      const telefone = faker.phone.number();
      const endereco = faker.location.streetAddress();
      clientes.push([nome, email, telefone, endereco]);
    }
    for (const c of clientes) {
      await pool.query(
        'INSERT INTO clientes (nome, email, telefone, endereco, criado_em) VALUES (?, ?, ?, ?, NOW())',
        c
      );
    }

    const fornecedores = [];
    for (let i = 0; i < 5; i++) {
      const nome = faker.company.name();
      const contato = faker.phone.number();
      fornecedores.push([nome, contato]);
    }
    for (const f of fornecedores) {
      await pool.query(
        'INSERT INTO fornecedores (nome, contato, criado_em) VALUES (?, ?, NOW())',
        f
      );
    }

    const produtos = [];
    for (let i = 0; i < 20; i++) {
      const nome = faker.commerce.productName();
      const categoria = faker.commerce.department();
      const tamanho = faker.helpers.arrayElement(['P', 'M', 'G', 'GG']);
      const cor = faker.color.human();
      const preco = faker.commerce.price({ min: 10, max: 500 });
      const estoque = faker.number.int({ min: 1, max: 100 });
      const fornecedor_id = faker.number.int({ min: 1, max: 5 });
      produtos.push([nome, categoria, tamanho, cor, preco, estoque, fornecedor_id]);
    }
    for (const p of produtos) {
      await pool.query(
        'INSERT INTO produtos (nome, categoria, tamanho, cor, preco, estoque, fornecedor_id, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        p
      );
    }

    const pedidos = [];
    for (let i = 0; i < 15; i++) {
      const cliente_id = faker.number.int({ min: 1, max: 10 });
      const status = faker.helpers.arrayElement(['Pendente', 'Em andamento', 'Finalizado']);
      const data = faker.date.past({ years: 1 });
      const total = faker.commerce.price({ min: 50, max: 2000 });
      pedidos.push([cliente_id, status, data, total]);
    }
    for (const p of pedidos) {
      await pool.query(
        'INSERT INTO pedidos (cliente_id, status, data, total) VALUES (?, ?, ?, ?)',
        p
      );
    }

    const producao = [];
    for (let i = 0; i < 20; i++) {
      const produto_id = faker.number.int({ min: 1, max: 20 });
      const quantidade = faker.number.int({ min: 1, max: 50 });
      const status = faker.helpers.arrayElement(['Pendente', 'Em andamento', 'Finalizado']);
      const prazo = faker.date.future({ years: 1 });
      producao.push([produto_id, quantidade, status, prazo]);
    }
    for (const p of producao) {
      await pool.query(
        'INSERT INTO producao (produto_id, quantidade, status, prazo, criado_em) VALUES (?, ?, ?, ?, NOW())',
        p
      );
    }

    const estoque = [];
    for (let i = 0; i < 30; i++) {
      const produto_id = faker.number.int({ min: 1, max: 20 });
      const quantidade = faker.number.int({ min: 1, max: 100 });
      const tipo = faker.helpers.arrayElement(['Entrada', 'Saída']);
      const data = faker.date.past({ years: 1 });
      estoque.push([produto_id, quantidade, tipo, data]);
    }
    for (const e of estoque) {
      await pool.query(
        'INSERT INTO entradas_saida_estoque (produto_id, quantidade, tipo, data) VALUES (?, ?, ?, ?)',
        e
      );
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
