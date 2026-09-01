import api from './api';

export async function cadastrar({ nome, email, senha }) {
  const resposta = await api.post('/auth/cadastro', { nome, email, senha });
  return resposta.data;
}

export async function login({ email, senha }) {
  const resposta = await api.post('/auth/login', { email, senha });
  const { token, administrador } = resposta.data;

  
  localStorage.setItem('token', token);
  localStorage.setItem('administrador', JSON.stringify(administrador));

  return { token, administrador };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('administrador');
}

export function getAdministradorLogado() {
  const dados = localStorage.getItem('administrador');
  return dados ? JSON.parse(dados) : null;
}

export function estaLogado() {
  return !!localStorage.getItem('token');
}