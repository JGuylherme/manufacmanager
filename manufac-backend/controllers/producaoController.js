const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM producao ORDER BY prazo ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { produto_id, quantidade, status, prazo } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO producao (produto_id, quantidade, status, prazo) VALUES (?,?,?,?)',
      [produto_id, quantidade, status, prazo]
    );
    res.json({ id: result.insertId, produto_id, quantidade, status, prazo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { produto_id, quantidade, status, prazo } = req.body;
  try {
    await pool.query(
      'UPDATE producao SET produto_id=?, quantidade=?, status=?, prazo=? WHERE id=?',
      [produto_id, quantidade, status, prazo, id]
    );
    res.json({ id, produto_id, quantidade, status, prazo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM producao WHERE id=?', [id]);
    res.json({ message: 'Produção deletada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
