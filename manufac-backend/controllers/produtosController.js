const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM produtos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { nome, categoria, tamanho, cor, preco, estoque, fornecedor_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO produtos (nome,categoria,tamanho,cor,preco,estoque,fornecedor_id) VALUES (?,?,?,?,?,?,?)',
      [nome, categoria, tamanho, cor, preco, estoque, fornecedor_id]
    );
    res.json({ id: result.insertId, nome, categoria, tamanho, cor, preco, estoque, fornecedor_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, categoria, tamanho, cor, preco, estoque, fornecedor_id } = req.body;
  try {
    await pool.query(
      'UPDATE produtos SET nome=?, categoria=?, tamanho=?, cor=?, preco=?, estoque=?, fornecedor_id=? WHERE id=?',
      [nome, categoria, tamanho, cor, preco, estoque, fornecedor_id, id]
    );
    res.json({ id, nome, categoria, tamanho, cor, preco, estoque, fornecedor_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM produtos WHERE id=?', [id]);
    res.json({ message: 'Produto deletado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
