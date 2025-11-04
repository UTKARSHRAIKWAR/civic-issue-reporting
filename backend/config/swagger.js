const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Civix API",
      version: "1.0.0",
      description:
        "API documentation for Civix - Civic Issue Reporting Platform",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://your-production-url.com/api"
            : "http://localhost:5000/api",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "./routes/*.js"),
    path.join(__dirname, "./controllers/*.js"),
  ],
};

const specs = swaggerJsdoc(options);
module.exports = { specs, swaggerUi };
