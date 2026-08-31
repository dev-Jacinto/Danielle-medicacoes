const express = require('express');
const Medicamento = require('../models/Medicamento');
const autenticar = require('../middleware/auth');

const router = express.Router();


router.use(autenticar);


router.post('/', (req, res) => {
  try {
    const { nome, dose, observacoes } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'O nome do medicamento é obrigatório.' });
    }

    const medicamento = Medicamento.criar({
      administrador_id: req.administrador.id, // vem do token, não do body (segurança)
      nome,
      dose,
      observacoes,
    });

    res.status(201).json({ medicamento });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar medicamento.' });
  }
});


router.get('/', (req, res) => {
  try {
    const medicamentos = Medicamento.listarPorAdministrador(req.administrador.id);
    res.json({ medicamentos });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar medicamentos.' });
  }
});


router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nome, dose, observacoes } = req.body;

    const medicamentoExistente = Medicamento.buscarPorId(id);
    if (!medicamentoExistente || medicamentoExistente.administrador_id !== req.administrador.id) {
      return res.status(404).json({ erro: 'Medicamento não encontrado.' });
    }

    const medicamento = Medicamento.atualizar(id, { nome, dose, observacoes });
    res.json({ medicamento });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar medicamento.' });
  }
});


router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const medicamentoExistente = Medicamento.buscarPorId(id);
    if (!medicamentoExistente || medicamentoExistente.administrador_id !== req.administrador.id) {
      return res.status(404).json({ erro: 'Medicamento não encontrado.' });
    }

    Medicamento.excluir(id);
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir medicamento.' });
  }
});

module.exports = router;