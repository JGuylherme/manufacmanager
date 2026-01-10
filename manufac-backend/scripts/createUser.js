require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createUser(nome, email, senha, papel = 'admin') {
  try {
    const hash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)',
      [nome, email, hash, papel]
    );

    console.log('Usuário criado com sucesso, ID:', result.insertId);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    process.exit(1);
  }
}

createUser('Admin', 'admin@email.com', 'abc123', 'admin');
