import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login({ email, senha });
      // Login deu certo, manda para o painel de medicamentos
      navigate('/painel');
    } catch (erroRequisicao) {
      const mensagem = erroRequisicao.response?.data?.erro || 'Erro ao fazer login. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <h1>Danielle Medicações</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            required
          />
        </div>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p>
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;