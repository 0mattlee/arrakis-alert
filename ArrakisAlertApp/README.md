# Arrakis Alert App

Este é o aplicativo móvel React Native (usando Expo) para o sistema de Alerta Arrakis. Ele permite que os utilizadores registem os seus dispositivos para receberem alertas de emergência da sua guilda do Discord.

## Configuração Essencial

A configuração de um aplicativo React Native com serviços como o Firebase Push Notifications é mais complexa do que um projeto de backend. Siga estes passos cuidadosamente.

1.  **Instalar Dependências:**
    Navegue até a pasta `ArrakisAlertApp` no seu terminal e execute:
    ```bash
    npm install
    ```

2.  **Configurar o Expo e EAS:**
    - Se ainda não o fez, crie uma conta em [expo.dev](https://expo.dev/).
    - Instale o EAS CLI globalmente: `npm install -g eas-cli`.
    - Faça login na sua conta Expo: `eas login`.
    - Configure o projeto: `eas project:init`. Isto irá criar um `eas.json` e ligar o seu projeto ao Expo. Copie o `projectId` gerado para o ficheiro `app.json` em `extra.eas.projectId`.

3.  **Configurar o Firebase para a App:**
    - No mesmo projeto Firebase que usou para o backend, adicione um novo aplicativo (um para iOS e um para Android).
    - **Para Android:**
        - Siga as instruções para registar a sua app. O `Android package name` deve ser o mesmo que está em `app.json` (ex: `com.yourcompany.arrakisalertapp`).
        - Faça o download do ficheiro `google-services.json` e coloque-o na raiz da pasta `ArrakisAlertApp`.
        - No Firebase Console, vá para "Cloud Messaging" (nas configurações do projeto) e ative a API "Firebase Cloud Messaging API (V1)".
    - **Para iOS:**
        - Siga as instruções para registar a sua app. O `iOS bundle ID` deve ser o mesmo que está em `app.json`.
        - Faça o download do ficheiro `GoogleService-Info.plist` e coloque-o na raiz da pasta `ArrakisAlertApp`.
        - No Firebase Console, em "Cloud Messaging", carregue a sua "APNs Authentication Key" da sua conta de developer da Apple. Este passo é crucial e complexo, requer uma subscrição de Apple Developer.

4.  **Configurar a URL do Backend:**
    - Abra o ficheiro `app.json`.
    - Encontre a secção `extra` e atualize o valor de `backendApiUrl` para a URL real onde o seu `ArrakisAlertAPI` está a ser executado (ex: `https://sua-api.onrender.com/api`).

5.  **Ficheiro de Som do Alarme:**
    - Obtenha um ficheiro de som `mp3` para o seu alarme.
    - Coloque-o na pasta `ArrakisAlertApp/assets/` e certifique-se de que o nome é exatamente `alarm.mp3`.
    - Remova o ficheiro `alarm.mp3.txt`.

6.  **Ícones e Imagens (Opcional mas Recomendado):**
    - Substitua os ficheiros placeholder em `assets/` (`icon.png`, `splash.png`, etc.) pelas suas próprias imagens para personalizar a aparência da app.

## Execução

-   **Para testar no Expo Go (funcionalidade limitada):**
    O Expo Go tem limitações, especialmente com configurações nativas como as do Firebase. No entanto, para testes de UI básicos:
    ```bash
    npm start
    ```
    Depois, leia o QR code com a app Expo Go no seu telemóvel. **Nota:** As notificações push podem não funcionar corretamente ou de todo no Expo Go sem o `projectId` correto.

-   **Para criar uma build de desenvolvimento (Recomendado):**
    Este método cria uma versão da sua app que inclui todas as configurações nativas e pode ser instalada no seu dispositivo.
    ```bash
    eas build --profile development --platform android (ou ios)
    ```
    Após a conclusão, o EAS fornecerá um link para descarregar e instalar a app no seu dispositivo.

-   **Para criar uma build de produção:**
    ```bash
    eas build --profile production --platform android (ou ios)
    ```
    Isto irá gerar um ficheiro `.apk` ou `.aab` (Android) ou um arquivo para a App Store (iOS) para distribuição.

## Como Usar a App

1.  Abra a aplicação no seu telemóvel.
2.  Insira o seu ID de utilizador do Discord (pode obtê-lo ativando o Modo de Desenvolvedor no Discord e copiando o seu ID).
3.  Insira o ID do Servidor (Guilda) do Discord que pretende monitorizar.
4.  Clique em "Registar Dispositivo".
5.  A aplicação irá pedir permissão para notificações. Aceite.
6.  Se tudo correr bem, verá uma mensagem de sucesso. A partir deste momento, o seu dispositivo está pronto para receber alertas.
