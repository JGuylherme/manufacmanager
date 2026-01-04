const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fornecedores');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { nome, contato } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO fornecedores (nome, contato) VALUES (?, ?)', [nome, contato]);
    res.json({ id: result.insertId, nome, contato });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, contato } = req.body;
  try {
    await pool.query('UPDATE fornecedores SET nome=?, contato=? WHERE id=?', [nome, contato, id]);
    res.json({ id, nome, contato });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM fornecedores WHERE id=?', [id]);
    res.json({ message: 'Fornecedor deletado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
