require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
    console.error('Por favor, defina DISCORD_TOKEN, CLIENT_ID e GUILD_ID no seu ficheiro .env');
    process.exit(1);
}

const commands = [
    new SlashCommandBuilder()
        .setName('arrakis-alert')
        .setDescription('Envia um alerta de emergência para a guilda.')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('A mensagem de alerta a ser enviada.')
                .setRequired(false)),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('A iniciar a atualização dos comandos de aplicação (/).');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Comandos de aplicação (/) recarregados com sucesso.');
    } catch (error) {
        console.error(error);
    }
})();
