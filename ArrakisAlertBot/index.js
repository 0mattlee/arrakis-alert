require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Obter as variáveis de ambiente
const { DISCORD_TOKEN, BACKEND_API_URL, BACKEND_API_KEY } = process.env;

if (!DISCORD_TOKEN || !BACKEND_API_URL || !BACKEND_API_KEY) {
    console.error('Por favor, defina DISCORD_TOKEN, BACKEND_API_URL, e BACKEND_API_KEY no seu ficheiro .env');
    process.exit(1);
}

// Criar uma nova instância do cliente
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Anexar as variáveis de ambiente ao cliente para acesso global nos comandos
client.config = { backendApiUrl: BACKEND_API_URL, backendApiKey: BACKEND_API_KEY };

// Criar uma Collection para os comandos
client.commands = new Collection();

// Carregar os ficheiros de comando dinamicamente
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Definir um novo item na Collection com a chave sendo o nome do comando e o valor sendo o módulo exportado
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[AVISO] O comando em ${filePath} não tem uma propriedade "data" ou "execute" obrigatória.`);
        }
    }
}

// Listener para quando o cliente está pronto
client.once(Events.ClientReady, readyClient => {
    console.log(`Bot está online como ${readyClient.user.tag}!`);
});

// Listener para interações (comandos)
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Nenhum comando correspondente a ${interaction.commandName} foi encontrado.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
        }
    }
});

// Login no Discord com o token do cliente
client.login(DISCORD_TOKEN);
