// Importa a biblioteca jsonwebtoken, usada para verificar/decodificar tokens JWT.
const jwt = require("jsonwebtoken");

// Carrega variáveis de ambiente do arquivo .env (por exemplo JWT_SECRET).
require("dotenv").config();

// Exporta a função middleware que será usada para proteger rotas.
// O middleware recebe (req, res, next) — padrão do Express.
module.exports = (req, res, next) => {

    // Lê o header "authorization" da requisição.
    // Esperamos algo no formato "Bearer <token>".
    const token = req.headers["authorization"];

    // Se não houver header Authorization, retornamos 401 (não autorizado).
    if (!token) {
        return res.status(401).json({ error: "Token não enviado" });
    }

    // Remove o prefixo "Bearer " (se existir) para obter apenas o token cru.
    // Ex.: "Bearer abc.def.ghi" -> "abc.def.ghi"
    const tokenLimpo = token.replace("Bearer ", "");

    try {
        // Verifica e decodifica o token usando a chave secreta do .env.
        // Se o token for inválido ou expirado, jwt.verify lançará um erro.
        const decoded = jwt.verify(tokenLimpo, process.env.JWT_SECRET);

        // Se a verificação passar, salvamos os dados decodificados em req.user
        // para que as rotas protegidas possam saber qual usuário está fazendo a requisição.
        req.user = decoded;

        // Chama next() para continuar o fluxo — permitindo acesso à rota protegida.
        next();
    } catch (err) {
        // Se ocorrer qualquer erro na verificação, retornamos 401 (token inválido).
        return res.status(401).json({ error: "Token inválido" });
    }
};
