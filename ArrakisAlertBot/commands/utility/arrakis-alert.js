const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('arrakis-alert')
        .setDescription('Envia um alerta de emergência para a guilda.')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('A mensagem de alerta a ser enviada.')
                .setRequired(false)),
    async execute(interaction) {
        // As variáveis de ambiente são acedidas através do cliente, onde as anexaremos.
        const backendApiUrl = interaction.client.config.backendApiUrl;
        const backendApiKey = interaction.client.config.backendApiKey;

        console.log('[DEBUG] Comando /arrakis-alert reconhecido. A processar...');
        await interaction.deferReply({ ephemeral: true });

        const message = interaction.options.getString('mensagem') || 'Emergência! Todos os membros online no Discord agora!';
        const guildId = interaction.guildId;
        const triggeredBy = interaction.user.id;

        try {
            console.log(`[DEBUG] A enviar requisição para: ${backendApiUrl}/trigger-alert`);
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
            console.log('[DEBUG] Resposta do backend recebida:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || `Erro no servidor backend: ${response.status}`);
            }

            await interaction.editReply({ content: `✅ Alerta Arrakis enviado com sucesso! Mensagem: "${message}". Notificações enviadas: ${responseData.sentCount}` });

        } catch (error) {
            console.error('Erro ao acionar o alerta:', error);
            await interaction.editReply({ content: `❌ Erro ao enviar o alerta. Por favor, verifique os logs do bot e do backend. Detalhes: ${error.message}` });
        }
    },
};
