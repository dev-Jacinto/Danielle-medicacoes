const db = require('./database');

function initDb() {
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS administradores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      criado_em TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  
  db.exec(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      administrador_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      dose TEXT,
      observacoes TEXT,
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (administrador_id) REFERENCES administradores(id) ON DELETE CASCADE
    )
  `);

  
  db.exec(`
    CREATE TABLE IF NOT EXISTS horarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicamento_id INTEGER NOT NULL,
      horario TEXT NOT NULL,
      ativo INTEGER NOT NULL DEFAULT 1,
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
    )
  `);

  console.log('Tabelas verificadas/criadas com sucesso.');
}

module.exports = initDb;