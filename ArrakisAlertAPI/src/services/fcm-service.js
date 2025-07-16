const admin = require('firebase-admin');
const fs = require('fs');

function initializeFirebase() {
    try {
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        if (!serviceAccountPath) {
            throw new Error("A variável de ambiente GOOGLE_APPLICATION_CREDENTIALS não está definida.");
        }

        console.log(`[FCM Service] A tentar ler o ficheiro de credenciais em: ${serviceAccountPath}`);
        
        // Ler o ficheiro explicitamente para garantir que ele existe e é acessível
        const serviceAccountRaw = fs.readFileSync(serviceAccountPath);
        const serviceAccount = JSON.parse(serviceAccountRaw);

        if (admin.apps.length === 0) { // Evita reinicializar a app
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id,
            });
            console.log(`[FCM Service] Firebase Admin SDK inicializado com sucesso para o projeto: ${serviceAccount.project_id}`);
        } else {
            console.log("[FCM Service] Firebase Admin SDK já estava inicializado.");
        }
    } catch (error) {
        console.error("[FCM Service] ERRO CRÍTICO AO INICIALIZAR O FIREBASE:", error);
        // Lançar o erro para que o processo principal possa falhar
        throw error;
    }
}


/**
 * Envia notificações push para uma lista de tokens de dispositivo.
 * @param {string[]} tokens - Um array de tokens de notificação push.
 * @param {string} title - O título da notificação.
 * @param {string} body - O corpo da mensagem da notificação.
 * @param {object} data - Dados personalizados a serem enviados com a notificação.
 * @returns {Promise<admin.messaging.BatchResponse>} A resposta do envio em lote do FCM.
 */
async function sendPushNotification(tokens, title, body, data) {
    if (!tokens || tokens.length === 0) {
        console.log("Nenhum token fornecido para enviar notificações.");
        return { successCount: 0, failureCount: 0, responses: [] };
    }

    const message = {
        notification: {
            title,
            body,
        },
        data,
        tokens,
        android: {
            priority: 'high',
            notification: {
                sound: 'default', // Para som padrão. Para um som personalizado, use o nome do ficheiro (ex: 'alarm.mp3')
                priority: 'high',
            },
        },
        apns: {
            payload: {
                aps: {
                    'content-available': 1,
                    sound: 'default', // Para som padrão. Para um som personalizado, use o nome do ficheiro (ex: 'alarm.caf')
                },
            },
            headers: {
                'apns-push-type': 'background', // ou 'alert'
                'apns-priority': '10',
            },
        },
    };

    try {
        const response = await admin.messaging().sendMulticast(message);
        console.log(`${response.successCount} mensagens enviadas com sucesso.`);
        return response;
    } catch (error) {
        console.error('Erro ao enviar notificações push:', error);
        throw error;
    }
}

module.exports = {
    initializeFirebase,
    sendPushNotification,
};
