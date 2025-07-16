# Arrakis Alert Bot

Este é o bot do Discord para o sistema de Alerta Arrakis. Ele é responsável por escutar um comando no Discord e acionar o backend para enviar notificações push.

## Configuração

1.  **Instalar Dependências:**
    Navegue até a pasta `ArrakisAlertBot` no seu terminal e execute o seguinte comando para instalar as dependências necessárias:
    ```bash
    npm install
    ```

2.  **Variáveis de Ambiente:**
    Renomeie o ficheiro `.env.example` para `.env` (se aplicável) ou crie um novo ficheiro chamado `.env` na raiz da pasta `ArrakisAlertBot` e preencha as seguintes variáveis:

    ```env
    # Token secreto do seu bot do Discord
    DISCORD_TOKEN=SEU_DISCORD_BOT_TOKEN

    # ID da aplicação/cliente do seu bot
    CLIENT_ID=SEU_CLIENT_ID

    # ID do servidor (guilda) do Discord onde os comandos serão testados/usados
    GUILD_ID=SEU_GUILD_ID

    # URL completa para o endpoint da sua API de backend
    BACKEND_API_URL=https://URL_DO_SEU_BACKEND/api

    # Chave de API para autenticar com o seu backend
    BACKEND_API_KEY=SUA_CHAVE_DE_API_SECRETA
    ```
    - `DISCORD_TOKEN`: Pode encontrar no Portal de Desenvolvedores do Discord, na secção "Bot" da sua aplicação.
    - `CLIENT_ID`: Pode encontrar na secção "General Information" da sua aplicação no portal.
    - `GUILD_ID`: Ative o Modo de Desenvolvedor no Discord, clique com o botão direito no ícone do seu servidor e selecione "Copiar ID do Servidor".

3.  **Registar Comandos:**
    Antes de iniciar o bot pela primeira vez, você precisa de registar o slash command (`/arrakis-alert`) no seu servidor do Discord. Execute o seguinte comando:
    ```bash
    npm run deploy
    ```
    Você deverá ver uma mensagem de sucesso no console.

## Execução

Para iniciar o bot, execute o seguinte comando:

```bash
npm start
```

O bot ficará online e pronto para receber comandos.

## Como Usar

No seu servidor do Discord, digite o comando:
`/arrakis-alert`

Opcionalmente, você pode adicionar uma mensagem:
`/arrakis-alert mensagem:Ataque iminente à base norte!`

O bot confirmará o envio do alerta.
