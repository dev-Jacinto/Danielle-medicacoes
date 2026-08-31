require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDb = require('./config/initDb');
const authRoutes = require('./routes/authRoutes');

// Cria as tabelas do banco de dados (se ainda não existirem)
initDb();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);

// Rota de teste (vamos substituir pelas rotas de verdade nas próximas partes)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Danielle Medicações' });
});

app.listen(PORT, () => {
  console.log(`Servidor Danielle Medicações rodando na porta ${PORT}`);
});