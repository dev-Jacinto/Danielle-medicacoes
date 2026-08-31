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

module.exports = router;