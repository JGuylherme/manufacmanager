const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM clientes ORDER BY criado_em DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const {
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
    ativo
  } = req.body;

  try {
    const [result] = await pool.query(
      `
      INSERT INTO clientes
      (nome, email, telefone, endereco, cidade, estado, tipo, cpf, cnpj, observacoes, ativo, criado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        nome,
        email,
        telefone,
        endereco,
        cidade || null,
        estado || null,
        tipo,
        tipo === 'PF' ? cpf : null,
        tipo === 'PJ' ? cnpj : null,
        observacoes || null,
        ativo ? 1 : 0
      ]
    );

    const [cliente] = await pool.query(
      'SELECT * FROM clientes WHERE id = ?',
      [result.insertId]
    );

    res.json(cliente[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
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
    ativo
  } = req.body;

  try {
    await pool.query(
      `
      UPDATE clientes SET
        nome = ?,
        email = ?,
        telefone = ?,
        endereco = ?,
        cidade = ?,
        estado = ?,
        tipo = ?,
        cpf = ?,
        cnpj = ?,
        observacoes = ?,
        ativo = ?,
        atualizado_em = NOW()
      WHERE id = ?
      `,
      [
        nome,
        email,
        telefone,
        endereco,
        cidade || null,
        estado || null,
        tipo,
        tipo === 'PF' ? cpf : null,
        tipo === 'PJ' ? cnpj : null,
        observacoes || null,
        ativo ? 1 : 0,
        id
      ]
    );

    const [cliente] = await pool.query(
      'SELECT * FROM clientes WHERE id = ?',
      [id]
    );

    res.json(cliente[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
    res.json({ message: 'Cliente deletado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
