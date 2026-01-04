const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nome, email, senha, papel } = req.body;
  try {
    const [userExists] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)',
      [nome, email, hashedPassword, papel]
    );

    const token = jwt.sign(
      { id: result.insertId, email, papel },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: result.insertId, nome, email, papel }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [userResult] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (userResult.length === 0) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    const user = userResult[0];
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ error: 'Email ou senha incorretos' });

    const token = jwt.sign(
      { id: user.id, email: user.email, papel: user.papel },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, papel: user.papel } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
