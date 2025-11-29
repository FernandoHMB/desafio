// Importa o mysql2, que é o driver responsável por conectar no MySQL.
const mysql = require('mysql2');

// Carrega as variáveis do arquivo .env (DB_HOST, DB_USER, etc).
require('dotenv').config();

// Cria uma conexão com o banco usando os dados do .env
const connection = mysql.createConnection({
    // Endereço do servidor MySQL (geralmente localhost)
    host: process.env.DB_HOST,

    // Usuário do MySQL (ex: root)
    user: process.env.DB_USER,

    // Senha do MySQL
    password: process.env.DB_PASS,

    // Nome do banco de dados onde estão as tabelas Order e Items
    database: process.env.DB_NAME
});

// Efetivamente tenta conectar no banco
connection.connect((err) => {
    // Se der erro, mostra no console e para aqui
    if (err) {
        console.error("Erro ao conectar no MySQL:", err);
        return;
    }

    // Se der certo, imprime confirmação
    console.log("MySQL conectado com sucesso!");
});

// Exporta a conexão para que outros arquivos possam usar ela
// (ex.: controllers vão chamar essa conexão para fazer INSERT/SELECT/UPDATE/DELETE)
module.exports = connection;
