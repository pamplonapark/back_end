const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PamplonaPark Documentation",
      version: "1.0.0",
      description: "Documentation for PamplonaPark",
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

module.exports = specs;