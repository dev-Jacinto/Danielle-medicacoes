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

salvarTokenReset(email, token, expiraEm) {
      const stmt = db.prepare(
        `UPDATE administradores SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`
      );
      return stmt.run(token, expiraEm, email);
    },
buscarPorTokenReset(token) {
      return db.prepare(
        `SELECT * FROM administradores WHERE reset_token = ?`
      ).get(token);
    },

atualizarSenha(id, nova_senha_hash) {
      const stmt = db.prepare(
        `UPDATE administradores SET senha_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`
      );
      return stmt.run(nova_senha_hash, id);
    },




};
 
module.exports = Administrador;
