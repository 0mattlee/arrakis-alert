require('dotenv').config();
const { Client, GatewayIntentBits, InteractionType } = require('discord.js');
const fetch = require('node-fetch'); // Certifique-se de instalar node-fetch se não estiver usando Node.js v18+

const token = process.env.DISCORD_TOKEN;
const backendApiUrl = process.env.BACKEND_API_URL;
const backendApiKey = process.env.BACKEND_API_KEY;

if (!token || !backendApiUrl || !backendApiKey) {
    console.error('Por favor, defina DISCORD_TOKEN, BACKEND_API_URL, e BACKEND_API_KEY no seu ficheiro .env');
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Bot está online como ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'arrakis-alert') {
        await interaction.deferReply({ ephemeral: true });

        const message = interaction.options.getString('mensagem') || 'Emergência! Todos os membros online no Discord agora!';
        const guildId = interaction.guildId;
        const triggeredBy = interaction.user.id;

        try {
            const response = await fetch(`${backendApiUrl}/trigger-alert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apiKey: backendApiKey,
                    guildId: guildId,
                    message: message,
                    triggeredByDiscordUserId: triggeredBy,
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Erro no servidor backend: ${response.status}`);
            }

            await interaction.editReply({ content: `✅ Alerta Arrakis enviado com sucesso! Mensagem: "${message}". Notificações enviadas: ${responseData.sentCount}` });

        } catch (error) {
            console.error('Erro ao acionar o alerta:', error);
            await interaction.editReply({ content: `❌ Erro ao enviar o alerta. Por favor, verifique os logs do bot e do backend. Detalhes: ${error.message}` });
        }
    }
});

client.login(token);
