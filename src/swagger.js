// Importa dependências do Swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Opções de configuração do Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Pedidos - Desafio Jitterbit",
            version: "1.0.0",
            description: "Documentação completa da API de pedidos com autenticação JWT."
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },

    // Arquivos onde o Swagger vai buscar anotações
    apis: ["./src/routes/*.js"]
};

// Gera o documento Swagger
const swaggerSpec = swaggerJsDoc(options);

// Exporta função que configura o Swagger no Express
module.exports = (app) => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
