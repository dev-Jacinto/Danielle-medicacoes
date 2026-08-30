require('dotenv').config();
 
const express = require('express');
const cors = require('cors');
 
const app = express();
const PORT = process.env.PORT || 3001;
 
// Middlewares globais (rodam em toda requisição, antes das rotas)
app.use(cors());          // permite que o frontend (outra porta/origem) acesse essa API
app.use(express.json());  // permite receber e ler JSON no corpo das requisições
 
// Rota de teste, só para confirmar que o servidor está no ar
// (nas próximas partes vamos substituir por rotas de verdade: login, medicamentos, etc.)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Danielle Medicações' });
});
 
app.listen(PORT, () => {
  console.log(`Servidor Danielle Medicações rodando na porta ${PORT}`);
});
 