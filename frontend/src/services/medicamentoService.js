import api from './api';

export async function listarMedicamentos() {
  const resposta = await api.get('/medicamentos');
  return resposta.data.medicamentos;
}

export async function criarMedicamento({ nome, dose, observacoes }) {
  const resposta = await api.post('/medicamentos', { nome, dose, observacoes });
  return resposta.data.medicamento;
}

export async function atualizarMedicamento(id, { nome, dose, observacoes }) {
  const resposta = await api.put(`/medicamentos/${id}`, { nome, dose, observacoes });
  return resposta.data.medicamento;
}

export async function excluirMedicamento(id) {
  await api.delete(`/medicamentos/${id}`);
}