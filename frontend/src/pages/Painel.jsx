import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdministradorLogado, logout } from '../services/authService';
import {
  listarMedicamentos,
  criarMedicamento,
  excluirMedicamento,
} from '../services/medicamentoService';
import {
  listarHorariosDoMedicamento,
  adicionarHorario,
  excluirHorario,
} from '../services/horarioService';

function Painel() {
  const navigate = useNavigate();
  const administrador = getAdministradorLogado();

  const [medicamentos, setMedicamentos] = useState([]);
  const [horariosPorMedicamento, setHorariosPorMedicamento] = useState({});

  // Campos do formulário de novo medicamento
  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Campo do formulário de novo horário (um por medicamento, controlado pelo id)
  const [novoHorario, setNovoHorario] = useState({});

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  async function carregarMedicamentos() {
    const lista = await listarMedicamentos();
    setMedicamentos(lista);

    // Para cada medicamento, busca os horários dele
    const horariosMap = {};
    for (const medicamento of lista) {
      horariosMap[medicamento.id] = await listarHorariosDoMedicamento(medicamento.id);
    }
    setHorariosPorMedicamento(horariosMap);
  }

  async function handleCriarMedicamento(evento) {
    evento.preventDefault();
    await criarMedicamento({ nome, dose, observacoes });
    setNome('');
    setDose('');
    setObservacoes('');
    carregarMedicamentos();
  }

  async function handleExcluirMedicamento(id) {
    await excluirMedicamento(id);
    carregarMedicamentos();
  }

  async function handleAdicionarHorario(evento, medicamentoId) {
    evento.preventDefault();
    const horario = novoHorario[medicamentoId];
    if (!horario) return;

    await adicionarHorario({ medicamento_id: medicamentoId, horario });
    setNovoHorario({ ...novoHorario, [medicamentoId]: '' });
    carregarMedicamentos();
  }

  async function handleExcluirHorario(id) {
    await excluirHorario(id);
    carregarMedicamentos();
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <header>
        <h1>Danielle Medicações</h1>
        <div>
          <span>{administrador?.nome} ({administrador?.email})</span>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <section>
        <h2>Novo medicamento</h2>
        <form onSubmit={handleCriarMedicamento}>
          <input
            type="text"
            placeholder="Nome do medicamento"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Dose (ex: 50mg)"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
          />
          <input
            type="text"
            placeholder="Observações"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
          <button type="submit">Adicionar medicamento</button>
        </form>
      </section>

      <section>
        <h2>Medicamentos cadastrados</h2>
        {medicamentos.length === 0 && <p>Nenhum medicamento cadastrado ainda.</p>}

        {medicamentos.map((medicamento) => (
          <div key={medicamento.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h3>{medicamento.nome} {medicamento.dose && `- ${medicamento.dose}`}</h3>
            {medicamento.observacoes && <p>{medicamento.observacoes}</p>}

            <ul>
              {(horariosPorMedicamento[medicamento.id] || []).map((horario) => (
                <li key={horario.id}>
                  {horario.horario}{' '}
                  <button onClick={() => handleExcluirHorario(horario.id)}>Remover</button>
                </li>
              ))}
            </ul>

            <form onSubmit={(e) => handleAdicionarHorario(e, medicamento.id)}>
              <input
                type="time"
                value={novoHorario[medicamento.id] || ''}
                onChange={(e) =>
                  setNovoHorario({ ...novoHorario, [medicamento.id]: e.target.value })
                }
                required
              />
              <button type="submit">Adicionar horário</button>
            </form>

            <button onClick={() => handleExcluirMedicamento(medicamento.id)}>
              Excluir medicamento
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Painel;