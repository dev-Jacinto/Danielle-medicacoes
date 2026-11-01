const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Administrador = require('../models/Administrador');
const autenticar = require('../middleware/auth');

const router = express.Router();


router.post('/cadastro', (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }

    
    const existente = Administrador.buscarPorEmail(email);
    if (existente) {
      return res.status(409).json({ erro: 'Já existe um administrador cadastrado com esse email.' });
    }

    
    const senha_hash = bcrypt.hashSync(senha, 10);

    const administrador = Administrador.criar({ nome, email, senha_hash });

    res.status(201).json({ administrador });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar administrador.' });
  }
});


router.post('/login', (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    const administrador = Administrador.buscarPorEmail(email);
    if (!administrador) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    
    const senhaCorreta = bcrypt.compareSync(senha, administrador.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    
    const token = jwt.sign(
      { id: administrador.id, nome: administrador.nome, email: administrador.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      administrador: { id: administrador.id, nome: administrador.nome, email: administrador.email },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
});


router.get('/me', autenticar, (req, res) => {
  res.json({ administrador: req.administrador });
});

router.post('/esqueci-senha', (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ erro: 'Email é obrigatório.' });

      const administrador = Administrador.buscarPorEmail(email);
      if (!administrador) return res.status(404).json({ erro: 'Email não encontrado.' });

      // Gera um token aleatório único
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Define que o código expira em 1 hora (3600000 milissegundos)
      const expiraEm = new Date(Date.now() + 3600000).toISOString();

      Administrador.salvarTokenReset(email, token, expiraEm);

      // SIMULAÇÃO: Imprime o código no console do backend para você testar
      console.log(`\n--- 📧 CÓDIGO DE RECUPERAÇÃO ---`);
      console.log(`Para: ${email}`);
      console.log(`Token: ${token}`);
      console.log(`------------------------------\n`);

      res.json({ mensagem: 'Se o email existir, um código de recuperação foi enviado.' });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao processar solicitação.' });
    }
  });

  router.post('/redefinir-senha', (req, res) => {
    try {
      const { token, novaSenha } = req.body;
      if (!token || !novaSenha) return res.status(400).json({ erro: 'Token e nova senha são obrigatórios.' });

      const administrador = Administrador.buscarPorTokenReset(token);
      if (!administrador) return res.status(400).json({ erro: 'Token inválido ou expirado.' });

      // Verifica se a data atual já passou da data de expiração
      if (new Date(administrador.reset_token_expiry) < new Date()) {
        return res.status(400).json({ erro: 'Este token já expirou.' });
      }

      const nova_senha_hash = bcrypt.hashSync(novaSenha, 10);
      Administrador.atualizarSenha(administrador.id, nova_senha_hash);

      res.json({ mensagem: 'Senha alterada com sucesso! Agora você pode fazer login.' });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao redefinir senha.' });
    }
  });




module.exports = router;