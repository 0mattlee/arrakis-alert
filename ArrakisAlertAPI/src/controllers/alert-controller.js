const db = require('../database/database');
const { sendPushNotification } = require('../services/fcm-service');

// Função para registar um novo dispositivo
exports.registerDevice = (req, res) => {
    const { discordUserId, pushToken, guildId } = req.body;

    if (!discordUserId || !pushToken || !guildId) {
        return res.status(400).json({ message: 'discordUserId, pushToken, e guildId são obrigatórios.' });
    }

    const query = `INSERT INTO devices (discordUserId, guildId, pushToken) VALUES (?, ?, ?)
                   ON CONFLICT(discordUserId, guildId, pushToken) DO NOTHING;`;

    db.run(query, [discordUserId, guildId, pushToken], function(err) {
        if (err) {
            console.error("Erro ao registar o dispositivo:", err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao registar o dispositivo.' });
        }
        if (this.changes > 0) {
            res.status(201).json({ message: 'Dispositivo registado com sucesso.' });
        } else {
            res.status(200).json({ message: 'O registo do dispositivo já existe.' });
        }
    });
};

// Função para acionar o alerta
exports.triggerAlert = async (req, res) => {
    const { guildId, message, triggeredByDiscordUserId } = req.body;

    if (!guildId) {
        return res.status(400).json({ message: 'guildId é obrigatório.' });
    }

    const query = `SELECT pushToken FROM devices WHERE guildId = ?`;

    db.all(query, [guildId], async (err, rows) => {
        if (err) {
            console.error("Erro ao consultar os tokens:", err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao consultar os tokens.' });
        }

        if (rows.length === 0) {
            return res.status(200).json({ message: 'Nenhum dispositivo registado para esta guilda.', sentCount: 0 });
        }

        const tokens = rows.map(row => row.pushToken);
        const title = '🚨 ALERTA ARRAKIS 🚨';
        const body = message || 'Emergência! Conecte-se ao Discord imediatamente!';
        const data = {
            type: 'emergency_alert',
            guildId,
            message: body,
            triggeredBy: triggeredByDiscordUserId || 'N/A'
        };

        try {
            const response = await sendPushNotification(tokens, title, body, data);
            
            // Lógica para remover tokens inválidos
            if (response.failureCount > 0) {
                const tokensToRemove = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        const errorCode = resp.error.code;
                        // https://firebase.google.com/docs/cloud-messaging/manage-tokens#detect-invalid-token-responses-from-the-fcm-backend
                        if (errorCode === 'messaging/invalid-registration-token' ||
                            errorCode === 'messaging/registration-token-not-registered') {
                            tokensToRemove.push(tokens[idx]);
                        }
                    }
                });

                if (tokensToRemove.length > 0) {
                    const placeholders = tokensToRemove.map(() => '?').join(',');
                    const deleteQuery = `DELETE FROM devices WHERE pushToken IN (${placeholders})`;
                    db.run(deleteQuery, tokensToRemove, (deleteErr) => {
                        if (deleteErr) {
                            console.error("Erro ao remover tokens inválidos:", deleteErr.message);
                        } else {
                            console.log(`${tokensToRemove.length} tokens inválidos removidos.`);
                        }
                    });
                }
            }

            res.status(200).json({ 
                message: 'Alerta acionado com sucesso.', 
                sentCount: response.successCount,
                failedCount: response.failureCount 
            });

        } catch (error) {
            console.error("Erro detalhado ao enviar notificações:", error);
            res.status(500).json({ message: 'Erro interno do servidor ao enviar notificações.', error: error.message });
        }
    });
};
