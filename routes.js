require('dotenv').config();
const express = require('express');
const app = express();

const loginRoutes = require('./src/routes/loginRoutes');

app.use('/login', loginRoutes);

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;