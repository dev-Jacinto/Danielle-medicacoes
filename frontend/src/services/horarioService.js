import api from './api';

export async function listarHorariosAtivos() {
  const resposta = await api.get('/horarios');
  return resposta.data.horarios;
}

export async function listarHorariosDoMedicamento(medicamentoId) {
  const resposta = await api.get(`/horarios/medicamento/${medicamentoId}`);
  return resposta.data.horarios;
}

export async function adicionarHorario({ medicamento_id, horario }) {
  const resposta = await api.post('/horarios', { medicamento_id, horario });
  return resposta.data.horario;
}

export async function excluirHorario(id) {
  await api.delete(`/horarios/${id}`);
}