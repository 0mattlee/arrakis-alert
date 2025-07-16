const db = require('./database');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discordUserId TEXT NOT NULL,
    guildId TEXT NOT NULL,
    pushToken TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(discordUserId, guildId, pushToken)
);
`;

db.serialize(() => {
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error("Erro ao criar a tabela 'devices':", err.message);
        } else {
            console.log("Tabela 'devices' criada ou já existente com sucesso.");
        }
    });

    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar a conexão com a base de dados', err.message);
        } else {
            console.log('Conexão com a base de dados fechada.');
        }
    });
});
