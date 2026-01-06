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
  const {
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
    ativo
  } = req.body;

  try {
    const [result] = await pool.query(
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
        ativo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nome,
        email,
        telefone,
        tipo,
        cpf || null,
        cnpj || null,
        endereco,
        cidade || null,
        estado || null,
        contato_responsavel,
        observacoes || null,
        ativo ?? true
      ]
    );

    res.json({
      id: result.insertId,
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
      ativo: ativo ?? true
    });
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
    tipo,
    cpf,
    cnpj,
    endereco,
    cidade,
    estado,
    contato_responsavel,
    observacoes,
    ativo
  } = req.body;

  try {
    await pool.query(
      `
      UPDATE fornecedores SET
        nome = ?,
        email = ?,
        telefone = ?,
        tipo = ?,
        cpf = ?,
        cnpj = ?,
        endereco = ?,
        cidade = ?,
        estado = ?,
        contato_responsavel = ?,
        observacoes = ?,
        ativo = ?
      WHERE id = ?
      `,
      [
        nome,
        email,
        telefone,
        tipo,
        cpf || null,
        cnpj || null,
        endereco,
        cidade || null,
        estado || null,
        contato_responsavel,
        observacoes || null,
        ativo,
        id
      ]
    );

    res.json({
      id: Number(id),
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
      ativo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      'DELETE FROM fornecedores WHERE id = ?',
      [id]
    );
    res.json({ message: 'Fornecedor deletado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
