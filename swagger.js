const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Enxoval Missionário - API",
      version: "1.0.0",
      description: "API para gerenciar usuários, itens e categorias relacionadas ao enxoval do missionário que está recebendo os itens",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "NOME DO USUÁRIO" },
            username: { type: "string", example: "nomeusuario" },
            password: { type: "string", example: "senha" },
            roles: { 
              type: "array",
              items: { type: "string" },
              example: ["role1", "role2"]
            },
            createdAt: { type: "string", example: "01/01/2025, 00:00:00" },
            createdBy: { type: "string", example: "nomeusuario" },
            updatedAt: { type: "string", example: "" },
            updatedBy: { type: "string", example: "" }
          }
        },
        Item: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            category: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "categoria" }
              }
            },
            remainQuantity: { type: "integer", example: 1 },
            totalQuantity: { type: "integer", example: 1 },
            name: { type: "string", example: "Nome do Item" },
            donations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Nome do doador" },
                  contact: { type: "string", example: "(15) 999999999" },
                  quantity: { type: "integer", example: 1 }
                }
              }
            },
            createdAt: { type: "string", example: "01/01/2025, 00:00:00" },
            createdBy: { type: "string", example: "nomeusuario" },
            updatedAt: { type: "string", example: "" },
            updatedBy: { type: "string", example: "" }
          }
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "roupa" },
            createdAt: { type: "string", example: "01/01/2025, 00:00:00" },
            createdBy: { type: "string", example: "nomeusuario" },
            updatedAt: { type: "string", example: "" },
            updatedBy: { type: "string", example: "" }
          }
        }
      }
    },
  },
  apis: ["routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
