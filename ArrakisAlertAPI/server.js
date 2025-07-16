// Carrega variáveis de ambiente do ficheiro .env apenas em ambientes que não são de produção
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const apiRoutes = require('./src/api/routes');
const { initializeFirebase } = require('./src/services/fcm-service');

// Inicializa o Firebase e para o processo se falhar
try {
    initializeFirebase();
} catch (error) {
    console.error("Não foi possível iniciar o servidor devido a um erro na inicialização do Firebase.");
    process.exit(1);
}

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
