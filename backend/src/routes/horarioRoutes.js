const express = require('express');
const Horario = require('../models/Horario');
const Medicamento = require('../models/Medicamento');
const autenticar = require('../middleware/auth');

const router = express.Router();

router.use(autenticar);

// GET /api/horarios
// Lista TODOS os horários ativos do administrador logado, com nome e dose
// do medicamento já junto. Usado pelo sistema de alarme para saber o que
// falta tomar e quando.
router.get('/', (req, res) => {
  try {
    const horarios = Horario.listarAtivosPorAdministrador(req.administrador.id);
    res.json({ horarios });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar horários.' });
  }
});

// POST /api/horarios
// Adiciona um horário a um medicamento existente
// Body esperado: { medicamento_id, horario } (horario no formato "HH:MM")
router.post('/', (req, res) => {
  try {
    const { medicamento_id, horario } = req.body;

    if (!medicamento_id || !horario) {
      return res.status(400).json({ erro: 'medicamento_id e horario são obrigatórios.' });
    }

    // Confirma que o medicamento existe e pertence ao administrador logado
    const medicamento = Medicamento.buscarPorId(medicamento_id);
    if (!medicamento || medicamento.administrador_id !== req.administrador.id) {
      return res.status(404).json({ erro: 'Medicamento não encontrado.' });
    }

    const novoHorario = Horario.criar({ medicamento_id, horario });
    res.status(201).json({ horario: novoHorario });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao adicionar horário.' });
  }
});

// GET /api/horarios/medicamento/:medicamentoId
// Lista os horários de um medicamento específico
router.get('/medicamento/:medicamentoId', (req, res) => {
  try {
    const { medicamentoId } = req.params;

    const medicamento = Medicamento.buscarPorId(medicamentoId);
    if (!medicamento || medicamento.administrador_id !== req.administrador.id) {
      return res.status(404).json({ erro: 'Medicamento não encontrado.' });
    }

    const horarios = Horario.listarPorMedicamento(medicamentoId);
    res.json({ horarios });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar horários.' });
  }
});

// DELETE /api/horarios/:id
// Remove um horário
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const horario = Horario.buscarComAdministrador(id);
    if (!horario || horario.administrador_id !== req.administrador.id) {
      return res.status(404).json({ erro: 'Horário não encontrado.' });
    }

    Horario.excluir(id);
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir horário.' });
  }
});

module.exports = router;