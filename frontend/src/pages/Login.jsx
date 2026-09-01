import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import './Auth.css';

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
      navigate('/painel');
    } catch (erroRequisicao) {
      const mensagem = erroRequisicao.response?.data?.erro || 'Erro ao fazer login. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-pagina">
      <div className="auth-painel-marca">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="8" rx="4" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
        <h1>Danielle Medicações</h1>
        <p>O horário certo, sempre lembrado.</p>
      </div>

      <div className="auth-painel-formulario">
        <div className="auth-formulario">
          <h2>Entrar</h2>
          <p>Acesse sua conta para ver seus medicamentos.</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-campo">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                required
              />
            </div>

            <div className="auth-campo">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                required
              />
            </div>

            {erro && <p className="auth-erro">{erro}</p>}

            <button type="submit" className="auth-botao" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth-rodape">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;