const db = require('../config/database');

const Horario = {
  
  criar({ medicamento_id, horario }) {
    const stmt = db.prepare(
      `INSERT INTO horarios (medicamento_id, horario) VALUES (?, ?)`
    );
    const info = stmt.run(medicamento_id, horario);
    return this.buscarPorId(info.lastInsertRowid);
  },

    listarPorMedicamento(medicamento_id) {
    return db
      .prepare(`SELECT * FROM horarios WHERE medicamento_id = ? ORDER BY horario ASC`)
      .all(medicamento_id);
  },

 
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

  excluir(id) {
    return db.prepare(`DELETE FROM horarios WHERE id = ?`).run(id);
  },
};

module.exports = Horario;