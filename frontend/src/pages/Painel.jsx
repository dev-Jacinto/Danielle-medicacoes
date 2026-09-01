import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdministradorLogado, logout } from '../services/authService';
import {
  listarMedicamentos,
  criarMedicamento,
  excluirMedicamento,
} from '../services/medicamentoService';
import {
  listarHorariosAtivos,
  listarHorariosDoMedicamento,
  adicionarHorario,
  excluirHorario,
} from '../services/horarioService';
import Alarme from '../components/Alarme';
import './Painel.css';

// Subtrai minutos de um horário no formato "HH:MM" e devolve outro "HH:MM"
function subtrairMinutos(horaMinuto, minutos) {
  const [h, m] = horaMinuto.split(':').map(Number);
  let totalMinutos = h * 60 + m - minutos;
  if (totalMinutos < 0) totalMinutos += 24 * 60; // não deixa passar da meia-noite pra trás
  const novaHora = String(Math.floor(totalMinutos / 60)).padStart(2, '0');
  const novoMinuto = String(totalMinutos % 60).padStart(2, '0');
  return `${novaHora}:${novoMinuto}`;
}

// Chave usada no localStorage para lembrar quais alarmes já foram fechados hoje
function chaveAlarmeFechado(horarioId) {
  const hoje = new Date().toISOString().slice(0, 10); // ex: "2026-08-31"
  return `alarme-fechado-${horarioId}-${hoje}`;
}

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

  // Guarda o alarme que deve aparecer na tela agora (ou null, se nenhum)
  const [alarmeAtivo, setAlarmeAtivo] = useState(null);

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  // A cada 20 segundos, verifica se algum horário está a 5 minutos de distância
  useEffect(() => {
    verificarAlarmes(); // roda uma vez assim que a página abre
    const intervalo = setInterval(verificarAlarmes, 20000);
    return () => clearInterval(intervalo);
  }, []);

  async function verificarAlarmes() {
    // Se já tem um alarme na tela, não verifica de novo (evita trocar o alarme no meio)
    if (alarmeAtivo) return;

    const horarios = await listarHorariosAtivos();

    const agora = new Date();
    const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

    for (const horario of horarios) {
      // Já foi fechado hoje? Pula.
      if (localStorage.getItem(chaveAlarmeFechado(horario.id))) continue;

      const horaAlarme = subtrairMinutos(horario.horario, 5);

      // Está entre "5 minutos antes" e o horário exato do remédio?
      if (horaAtual >= horaAlarme && horaAtual <= horario.horario) {
        setAlarmeAtivo(horario);
        break; // mostra só um alarme por vez
      }
    }
  }

  function handleFecharAlarme() {
    if (alarmeAtivo) {
      localStorage.setItem(chaveAlarmeFechado(alarmeAtivo.id), 'true');
    }
    setAlarmeAtivo(null);
  }

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
    <>
      {alarmeAtivo && (
        <Alarme
          medicamentoNome={alarmeAtivo.medicamento_nome}
          dose={alarmeAtivo.dose}
          onFechar={handleFecharAlarme}
        />
      )}
      <div className="painel-pagina">
        <header className="painel-header">
        <h1>Danielle Medicações</h1>
        <div className="painel-usuario">
          <span>{administrador?.nome} ({administrador?.email})</span>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <div className="painel-conteudo">
      <section>
        <h2>Novo medicamento</h2>
        <form onSubmit={handleCriarMedicamento} className="form-medicamento">
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
        {medicamentos.length === 0 && <p className="texto-vazio">Nenhum medicamento cadastrado ainda.</p>}

        <div className="lista-medicamentos">
        {medicamentos.map((medicamento) => (
          <div key={medicamento.id} className="medicamento-card">
            <h3>
              {medicamento.nome}
              {medicamento.dose && <span className="dose">{medicamento.dose}</span>}
            </h3>
            {medicamento.observacoes && <p className="observacoes">{medicamento.observacoes}</p>}

            <ul className="horarios-lista">
              {(horariosPorMedicamento[medicamento.id] || []).map((horario) => (
                <li key={horario.id} className="horario-chip">
                  {horario.horario}
                  <button onClick={() => handleExcluirHorario(horario.id)}>×</button>
                </li>
              ))}
            </ul>

            <form onSubmit={(e) => handleAdicionarHorario(e, medicamento.id)} className="form-horario">
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

            <button onClick={() => handleExcluirMedicamento(medicamento.id)} className="botao-excluir-medicamento">
              Excluir medicamento
            </button>
          </div>
        ))}
        </div>
      </section>
      </div>
    </div>
    </>
  );
}

export default Painel;