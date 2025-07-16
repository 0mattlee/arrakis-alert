require('dotenv').config({ path: '../../.env' });
const admin = require('firebase-admin');

try {
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountPath) {
        throw new Error("A variável de ambiente GOOGLE_APPLICATION_CREDENTIALS não está definida.");
    }
    const serviceAccount = require(serviceAccountPath);

    // A variável de ambiente GOOGLE_APPLICATION_CREDENTIALS aponta para o ficheiro de credenciais
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id, // Especificar explicitamente o ID do projeto
    });
    console.log(`Firebase Admin SDK inicializado com sucesso para o projeto: ${serviceAccount.project_id}`);
} catch (error) {
    console.error("Erro ao inicializar o Firebase Admin SDK:", error);
    console.log("Certifique-se de que a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS está a apontar para um ficheiro serviceAccountKey.json válido.");
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
    sendPushNotification,
    admin
};
