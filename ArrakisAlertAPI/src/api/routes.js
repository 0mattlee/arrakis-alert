const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert-controller');

// Middleware de autenticação por chave de API
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.body.apiKey || req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: 'Chave de API não fornecida.' });
    }
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: 'Chave de API inválida.' });
    }
    next();
};

// Rota para registar um dispositivo
// POST /api/register-device
router.post('/register-device', alertController.registerDevice);

// Rota para acionar um alerta
// POST /api/trigger-alert
router.post('/trigger-alert', apiKeyAuth, alertController.triggerAlert);

module.exports = router;
