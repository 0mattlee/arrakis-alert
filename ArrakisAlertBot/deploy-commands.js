require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
    console.error('Por favor, defina DISCORD_TOKEN, CLIENT_ID e GUILD_ID no seu ficheiro .env');
    process.exit(1);
}

const commands = [];
// Obter todas as pastas dentro da pasta de comandos
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Obter todos os ficheiros de comando dentro de cada pasta
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[AVISO] O comando em ${filePath} não tem uma propriedade "data" ou "execute" obrigatória.`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`A iniciar a atualização de ${commands.length} comandos de aplicação (/).`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Foram recarregados com sucesso ${data.length} comandos de aplicação (/).`);
    } catch (error) {
        console.error(error);
    }
})();
