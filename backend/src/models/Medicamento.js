const db = require('../config/database');

const Medicamento = {
  
  criar({ administrador_id, nome, dose, observacoes }) {
    const stmt = db.prepare(
      `INSERT INTO medicamentos (administrador_id, nome, dose, observacoes) VALUES (?, ?, ?, ?)`
    );
    const info = stmt.run(administrador_id, nome, dose || null, observacoes || null);
    return this.buscarPorId(info.lastInsertRowid);
  },

  
  listarPorAdministrador(administrador_id) {
    return db
      .prepare(`SELECT * FROM medicamentos WHERE administrador_id = ? ORDER BY criado_em DESC`)
      .all(administrador_id);
  },

  buscarPorId(id) {
    return db.prepare(`SELECT * FROM medicamentos WHERE id = ?`).get(id);
  },

  atualizar(id, { nome, dose, observacoes }) {
    db.prepare(
      `UPDATE medicamentos SET nome = ?, dose = ?, observacoes = ? WHERE id = ?`
    ).run(nome, dose || null, observacoes || null, id);
    return this.buscarPorId(id);
  },

    
  excluir(id) {
    return db.prepare(`DELETE FROM medicamentos WHERE id = ?`).run(id);
  },
};

module.exports = Medicamento;