import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cadastrar } from '../services/authService';

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await cadastrar({ nome, email, senha });
      // Depois de cadastrar com sucesso, manda a pessoa para a tela de login
      navigate('/login');
    } catch (erroRequisicao) {
      const mensagem = erroRequisicao.response?.data?.erro || 'Erro ao cadastrar. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <h1>Danielle Medicações</h1>
      <h2>Cadastro de administrador</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            required
          />
        </div>

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
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p>
        Já tem uma conta? <Link to="/login">Fazer login</Link>
      </p>
    </div>
  );
}

export default Cadastro;