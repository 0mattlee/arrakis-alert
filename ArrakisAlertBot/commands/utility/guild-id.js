const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-id')
        .setDescription('Mostra o ID deste servidor (guilda).'),
    async execute(interaction) {
        await interaction.reply({
            content: `O ID deste servidor (guilda) é: \`${interaction.guildId}\`\n\nUse este ID no campo "ID do Servidor" da aplicação móvel Arrakis Alert.`,
            ephemeral: true // Apenas o utilizador que executou o comando pode ver esta mensagem
        });
    },
};
