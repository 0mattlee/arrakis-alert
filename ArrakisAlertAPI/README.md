# Arrakis Alert API

Este é o servidor backend para o sistema de Alerta Arrakis. Ele fornece endpoints para registar dispositivos e para acionar as notificações push via Firebase Cloud Messaging (FCM).

## Configuração

1.  **Instalar Dependências:**
    Navegue até a pasta `ArrakisAlertAPI` no seu terminal e execute o seguinte comando para instalar as dependências:
    ```bash
    npm install
    ```

2.  **Firebase Admin SDK:**
    - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
    - Nas configurações do projeto, vá para a aba "Contas de serviço".
    - Clique em "Gerar nova chave privada" e faça o download do ficheiro JSON.
    - Coloque este ficheiro na raiz da pasta `ArrakisAlertAPI` e renomeie-o para `firebase-service-account.json` (ou o nome que preferir, mas ajuste a variável de ambiente).

3.  **Variáveis de Ambiente:**
    Crie um ficheiro chamado `.env` na raiz da pasta `ArrakisAlertAPI` e preencha as seguintes variáveis:

    ```env
    # Porta em que o servidor irá correr
    PORT=3000

    # Chave de API secreta para proteger o endpoint de alerta.
    # DEVE SER A MESMA CHAVE USADA NO FICHEIRO .env DO BOT.
    API_KEY=SUA_CHAVE_DE_API_SECRETA

    # Caminho para o ficheiro de credenciais do Firebase Admin SDK
    GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json

    # Caminho onde o ficheiro da base de dados SQLite será guardado
    DB_PATH=./arrakis-alert.db
    ```

4.  **Inicializar a Base de Dados:**
    Para criar a tabela necessária na base de dados SQLite, execute o seguinte comando uma vez:
    ```bash
    npm run db:init
    ```
    Isto irá criar o ficheiro `arrakis-alert.db` com a estrutura correta.

## Execução

Para iniciar o servidor em modo de produção, execute:
```bash
npm start
```

Para iniciar o servidor em modo de desenvolvimento com reinício automático (usando `nodemon`), execute:
```bash
npm run dev
```

O servidor estará a correr e pronto para receber requisições na porta especificada (padrão: 3000).

## Endpoints da API

-   `POST /api/register-device`
    -   Regista um dispositivo para receber notificações.
    -   **Corpo da Requisição (JSON):**
        ```json
        {
          "discordUserId": "ID_DO_USUARIO_DISCORD",
          "pushToken": "TOKEN_DO_DISPOSITIVO_FCM",
          "guildId": "ID_DA_GUILDA_DISCORD"
        }
        ```

-   `POST /api/trigger-alert`
    -   Aciona o envio de notificações para uma guilda.
    -   **Autenticação:** Requer uma chave de API no corpo ou no cabeçalho `x-api-key`.
    -   **Corpo da Requisição (JSON):**
        ```json
        {
          "apiKey": "SUA_CHAVE_DE_API_SECRETA",
          "guildId": "ID_DA_GUILDA_DISCORD",
          "message": "Mensagem de alerta opcional",
          "triggeredByDiscordUserId": "ID_DO_USUARIO_QUE_ACIONOU"
        }
