const db = require('../config/database');

const Horario = {
  // Adiciona um horário a um medicamento (formato esperado: "HH:MM", ex: "08:30")
  criar({ medicamento_id, horario }) {
    const stmt = db.prepare(
      `INSERT INTO horarios (medicamento_id, horario) VALUES (?, ?)`
    );
    const info = stmt.run(medicamento_id, horario);
    return this.buscarPorId(info.lastInsertRowid);
  },

  // Lista os horários de um medicamento específico
  listarPorMedicamento(medicamento_id) {
    return db
      .prepare(`SELECT * FROM horarios WHERE medicamento_id = ? ORDER BY horario ASC`)
      .all(medicamento_id);
  },

  // Lista TODOS os horários ativos de um administrador, já com o nome e dose
  // do medicamento junto (usando JOIN). Essa é a consulta que o sistema de
  // alarme vai usar para saber "o que falta tomar e quando".
  listarAtivosPorAdministrador(administrador_id) {
    return db
      .prepare(
        `SELECT horarios.id, horarios.horario, medicamentos.nome AS medicamento_nome, medicamentos.dose
         FROM horarios
         JOIN medicamentos ON medicamentos.id = horarios.medicamento_id
         WHERE medicamentos.administrador_id = ? AND horarios.ativo = 1`
      )
      .all(administrador_id);
  },

  buscarPorId(id) {
    return db.prepare(`SELECT * FROM horarios WHERE id = ?`).get(id);
  },

  // Busca um horário já trazendo o administrador_id do medicamento dono dele.
  // Usado para verificar permissão antes de excluir (só o dono pode excluir).
  buscarComAdministrador(id) {
    return db
      .prepare(
        `SELECT horarios.*, medicamentos.administrador_id
         FROM horarios
         JOIN medicamentos ON medicamentos.id = horarios.medicamento_id
         WHERE horarios.id = ?`
      )
      .get(id);
  },

  excluir(id) {
    return db.prepare(`DELETE FROM horarios WHERE id = ?`).run(id);
  },
};

module.exports = Horario;