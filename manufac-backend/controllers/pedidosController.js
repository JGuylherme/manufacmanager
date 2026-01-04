const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pedidos ORDER BY data DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { cliente_id, status, data, total } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO pedidos (cliente_id, status, data, total) VALUES (?,?,?,?)',
      [cliente_id, status, data, total]
    );
    res.json({ id: result.insertId, cliente_id, status, data, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { cliente_id, status, data, total } = req.body;
  try {
    await pool.query(
      'UPDATE pedidos SET cliente_id=?, status=?, data=?, total=? WHERE id=?',
      [cliente_id, status, data, total, id]
    );
    res.json({ id, cliente_id, status, data, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM pedidos WHERE id=?', [id]);
    res.json({ message: 'Pedido deletado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
