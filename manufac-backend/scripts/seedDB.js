require('dotenv').config({ path: '../.env' });
const { faker } = require('@faker-js/faker');
const pool = require('../config/db');

async function seed() {
  try {

    await pool.query('SET FOREIGN_KEY_CHECKS = 0');

    await pool.query('DELETE FROM producao');
    await pool.query('DELETE FROM pedidos');
    await pool.query('DELETE FROM entradas_saida_estoque');
    await pool.query('DELETE FROM produtos');
    await pool.query('DELETE FROM fornecedores');
    await pool.query('DELETE FROM clientes');

    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    for (let i = 0; i < 10; i++) {
      const tipo = faker.helpers.arrayElement(['PF', 'PJ']);

      const nome =
        tipo === 'PF'
          ? faker.person.fullName()
          : faker.company.name();

      const email = faker.internet.email();
      const telefone = faker.phone.number();
      const endereco = faker.location.streetAddress();
      const cidade = faker.location.city();
      const estado = faker.location.state({ abbreviated: true });
      const cpf = tipo === 'PF' ? faker.string.numeric(11) : null;
      const cnpj = tipo === 'PJ' ? faker.string.numeric(14) : null;
      const observacoes = faker.lorem.sentence();
      const ativo = faker.datatype.boolean();

      await pool.query(
        `
        INSERT INTO clientes
        (
          nome,
          email,
          telefone,
          endereco,
          cidade,
          estado,
          tipo,
          cpf,
          cnpj,
          observacoes,
          ativo,
          criado_em
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          nome,
          email,
          telefone,
          endereco,
          cidade,
          estado,
          tipo,
          cpf,
          cnpj,
          observacoes,
          ativo ? 1 : 0
        ]
      );
    }

    for (let i = 0; i < 5; i++) {
      const tipo = faker.helpers.arrayElement(['PF', 'PJ']);

      const nome =
        tipo === 'PF'
          ? faker.person.fullName()
          : faker.company.name();

      const email = faker.internet.email();
      const telefone = faker.phone.number();
      const endereco = faker.location.streetAddress();
      const cidade = faker.location.city();
      const estado = faker.location.state({ abbreviated: true });

      const cpf = tipo === 'PF' ? faker.string.numeric(11) : null;
      const cnpj = tipo === 'PJ' ? faker.string.numeric(14) : null;

      const contato_responsavel =
        tipo === 'PF'
          ? nome
          : faker.person.fullName();

      const observacoes = faker.lorem.sentence();
      const ativo = faker.datatype.boolean();

      await pool.query(
        `
    INSERT INTO fornecedores
    (
      nome,
      email,
      telefone,
      tipo,
      cpf,
      cnpj,
      endereco,
      cidade,
      estado,
      contato_responsavel,
      observacoes,
      ativo,
      criado_em
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `,
        [
          nome,
          email,
          telefone,
          tipo,
          cpf,
          cnpj,
          endereco,
          cidade,
          estado,
          contato_responsavel,
          observacoes,
          ativo ? 1 : 0
        ]
      );
    }

    for (let i = 0; i < 20; i++) {
      const nome = faker.commerce.productName();
      const categoria = faker.commerce.department();
      const tamanho = faker.helpers.arrayElement(['P', 'M', 'G', 'GG']);
      const cor = faker.color.human();
      const preco = faker.commerce.price({ min: 10, max: 500 });
      const estoque = faker.number.int({ min: 1, max: 100 });
      const fornecedor_id = faker.number.int({ min: 1, max: 5 });

      await pool.query(
        `
        INSERT INTO produtos
        (nome, categoria, tamanho, cor, preco, estoque, fornecedor_id, criado_em)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [nome, categoria, tamanho, cor, preco, estoque, fornecedor_id]
      );
    }

    for (let i = 0; i < 15; i++) {
      const cliente_id = faker.number.int({ min: 1, max: 10 });
      const status = faker.helpers.arrayElement([
        'Pendente',
        'Em andamento',
        'Finalizado'
      ]);
      const data = faker.date.past({ years: 1 });
      const total = faker.commerce.price({ min: 50, max: 2000 });

      await pool.query(
        `
        INSERT INTO pedidos
        (cliente_id, status, data, total)
        VALUES (?, ?, ?, ?)
        `,
        [cliente_id, status, data, total]
      );
    }

    for (let i = 0; i < 20; i++) {
      const produto_id = faker.number.int({ min: 1, max: 20 });
      const quantidade = faker.number.int({ min: 1, max: 50 });
      const status = faker.helpers.arrayElement([
        'Pendente',
        'Em andamento',
        'Finalizado'
      ]);
      const prazo = faker.date.future({ years: 1 });

      await pool.query(
        `
        INSERT INTO producao
        (produto_id, quantidade, status, prazo, criado_em)
        VALUES (?, ?, ?, ?, NOW())
        `,
        [produto_id, quantidade, status, prazo]
      );
    }

    for (let i = 0; i < 30; i++) {
      const produto_id = faker.number.int({ min: 1, max: 20 });
      const quantidade = faker.number.int({ min: 1, max: 100 });
      const tipo = faker.helpers.arrayElement(['Entrada', 'Saída']);
      const data = faker.date.past({ years: 1 });

      await pool.query(
        `
        INSERT INTO entradas_saida_estoque
        (produto_id, quantidade, tipo, data)
        VALUES (?, ?, ?, ?)
        `,
        [produto_id, quantidade, tipo, data]
      );
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seed();
