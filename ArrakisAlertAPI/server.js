require('dotenv').config();
const express = require('express');
const apiRoutes = require('./src/api/routes');

// Inicializar o serviço FCM para que o Firebase seja configurado no arranque
require('./src/services/fcm-service'); 

// A verificação das variáveis de ambiente foi temporariamente removida para depuração no Render.
// O Render parece estar a ter problemas a injetar as variáveis antes do arranque inicial.
// A aplicação irá agora falhar mais tarde se as variáveis estiverem de facto em falta.

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rota de health check
app.get('/', (req, res) => {
    res.send('Arrakis Alert API está operacional!');
});

// Montar as rotas da API sob o prefixo /api
app.use('/api', apiRoutes);

// Middleware para tratamento de erros 404 (rota não encontrada)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada.' });
});

// Middleware para tratamento de outros erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
});

app.listen(port, () => {
    console.log(`Servidor Arrakis Alert API a correr na porta ${port}`);
});
