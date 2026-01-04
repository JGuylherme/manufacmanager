const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { nome, email, telefone, endereco } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, endereco]
    );
    res.json({ id: result.insertId, nome, email, telefone, endereco });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco } = req.body;
  try {
    await pool.query(
      'UPDATE clientes SET nome=?, email=?, telefone=?, endereco=? WHERE id=?',
      [nome, email, telefone, endereco, id]
    );
    res.json({ id, nome, email, telefone, endereco });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clientes WHERE id=?', [id]);
    res.json({ message: 'Cliente deletado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
