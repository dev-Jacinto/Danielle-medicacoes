const Database = require('better-sqlite3');
const path = require('path');

// O arquivo do banco de dados fica na raiz da pasta backend
const dbPath = path.join(__dirname, '..', '..', 'database.sqlite');
const db = new Database(dbPath);

// Ativa a verificação de chaves estrangeiras (garante que, por exemplo,
// não seja possível criar um medicamento apontando para um administrador que não existe)
db.pragma('foreign_keys = ON');

module.exports = db;