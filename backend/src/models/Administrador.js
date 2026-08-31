const db = require('../config/database');
 
const Administrador = {
  // Cria um novo administrador no banco (a senha já deve chegar criptografada)
  criar({ nome, email, senha_hash }) {
    const stmt = db.prepare(
      `INSERT INTO administradores (nome, email, senha_hash) VALUES (?, ?, ?)`
    );
    const info = stmt.run(nome, email, senha_hash);
    return this.buscarPorId(info.lastInsertRowid);
  },
 
  // Usado no login: busca com a senha_hash incluída, para comparar
  buscarPorEmail(email) {
    return db.prepare(`SELECT * FROM administradores WHERE email = ?`).get(email);
  },
 
  // Usado depois do login: busca SEM a senha_hash, por segurança
  buscarPorId(id) {
    return db
      .prepare(`SELECT id, nome, email, criado_em FROM administradores WHERE id = ?`)
      .get(id);
  },
};
 
module.exports = Administrador;
