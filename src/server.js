// Carrega variáveis do arquivo .env (PORT, DB_* e JWT_SECRET)
require('dotenv').config();

// Importa o Express (framework para criar o servidor HTTP)
const express = require('express');

// Cria a instância do Express
const app = express();

// Habilita o parse de JSON no corpo das requisições.
// Importante: sem isso, req.body será undefined para requisições JSON.
app.use(express.json());

// -----------------------------
// Importa rotas e middlewares
// -----------------------------
const orderRoutes = require('./routes/orderRoutes');       // rotas de pedido (POST, GET, PUT, DELETE)
const authRoutes = require('./routes/authRoutes');         // rota de login (POST /auth/login)
const authMiddleware = require('./middleware/authMiddleware'); // middleware JWT que comentamos

// -----------------------------
// Swagger (documentação)
// -----------------------------
// Requer e inicializa a configuração do Swagger (arquivo src/swagger.js)
// Esse arquivo deve exportar uma função que recebe `app` e monta /docs.
try {
    require('./swagger')(app);
    // Se o arquivo swagger.js existir e funcionar, a documentação ficará em /docs
} catch (err) {
    // Se swagger não existir (por enquanto), apenas logamos e seguimos.
    console.warn('Swagger não foi inicializado:', err.message);
}

// -----------------------------
// Rotas públicas
// -----------------------------

// Rota de autenticação (login) — pública (retorna token JWT)
app.use('/auth', authRoutes);

// -----------------------------
// Rotas protegidas por JWT
// -----------------------------
// Aqui registramos as rotas de pedido protegidas pelo middleware.
// Todas as requisições para /order/* precisarão enviar o header:
// Authorization: Bearer <TOKEN>
app.use('/order', authMiddleware, orderRoutes);

// -----------------------------
// Inicia o servidor
// -----------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
