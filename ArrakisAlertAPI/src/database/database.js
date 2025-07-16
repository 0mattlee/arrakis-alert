require('dotenv').config({ path: '../../.env' });
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DB_PATH || 'arrakis-alert.db';

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir a base de dados', err.message);
    } else {
        console.log('Conectado à base de dados SQLite.');
    }
});

module.exports = db;
