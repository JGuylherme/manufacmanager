const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');
const clientesRoutes = require('./routes/clientes');
const fornecedoresRoutes = require('./routes/fornecedores');
const pedidosRoutes = require('./routes/pedidos');
const producaoRoutes = require('./routes/producao');
const estoqueRoutes = require('./routes/estoque');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/fornecedores', fornecedoresRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/producao', producaoRoutes);
app.use('/api/estoque', estoqueRoutes);

app.get('/', (req, res) => {
  res.send('Backend do sistema de management está rodando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
