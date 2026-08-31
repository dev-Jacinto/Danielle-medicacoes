const db = require('../config/database');
 
const Administrador = {
  
  criar({ nome, email, senha_hash }) {
    const stmt = db.prepare(
      `INSERT INTO administradores (nome, email, senha_hash) VALUES (?, ?, ?)`
    );
    const info = stmt.run(nome, email, senha_hash);
    return this.buscarPorId(info.lastInsertRowid);
  },
 
  
  buscarPorEmail(email) {
    return db.prepare(`SELECT * FROM administradores WHERE email = ?`).get(email);
  },
 
  
  buscarPorId(id) {
    return db
      .prepare(`SELECT id, nome, email, criado_em FROM administradores WHERE id = ?`)
      .get(id);
  },
};
 
module.exports = Administrador;
