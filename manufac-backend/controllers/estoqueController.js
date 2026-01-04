const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM entradas_saida_estoque ORDER BY data DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { produto_id, quantidade, tipo, data } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO entradas_saida_estoque (produto_id, quantidade, tipo, data) VALUES (?,?,?,?)',
      [produto_id, quantidade, tipo, data]
    );
    res.json({ id: result.insertId, produto_id, quantidade, tipo, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { produto_id, quantidade, tipo, data } = req.body;
  try {
    await pool.query(
      'UPDATE entradas_saida_estoque SET produto_id=?, quantidade=?, tipo=?, data=? WHERE id=?',
      [produto_id, quantidade, tipo, data, id]
    );
    res.json({ id, produto_id, quantidade, tipo, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM entradas_saida_estoque WHERE id=?', [id]);
    res.json({ message: 'Registro de estoque deletado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
