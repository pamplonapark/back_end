const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./src/internal/functions/logger");
const app = express();
const { initMySQLDatabase, closePool } = require("./src/internal/databases/mysql_connector");
const activateWorkerManager = require("./src/internal/functions/WorkerManager.js");
const { generateRandomAESKey } = require("./src/internal/functions/crypto");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger-config.js");
const basicAuth = require('express-basic-auth');

require("dotenv").config({ path: `${__dirname}/.env`, override: true });
let environment = process.env.ENVIRONMENT;

app.use(helmet()); // Set various HTTP headers for security
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) }, // Log HTTP requests
  })
);
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.set("view engine", "jade"); // Set the view engine for rendering templates

app.use("/parkings", require("./src/routes/parkings.js"));
app.use("/accounts", require("./src/routes/accounts.js"));

// Sets the user and password to access swagger documentation
let admin_password = process.env.ADMIN_PASSWORD;
if (environment == "development") admin_password = process.env.ADMIN_PASSWORD;
app.use("/v1/docs", basicAuth({ users: { "admin": admin_password }, challenge: true }), swaggerUi.serve, swaggerUi.setup(swaggerSpecs)); // Route for Swagger docs

app.use("/v1/dashboard", (req, res) => res.redirect("https://app.pm2.io/")); // Redirection to dashboard

/* IF 404 PETITION IS SENT */
app.use("*", (req, res) => {
  res.status(404);

  // respond with html page
  if (req.accepts("html"))
    return res
      .status(404)
      .sendFile(require("path").join(__dirname + "/src/public/index.html"));

  // respond with json
  if (req.accepts("json"))
    return res
      .status(404)
      .json({ code: 404, error: "Bad request - Not found" });

  // default to plain-text. send()
  res.type("txt").status(404).send("Code 404 - Bad request - Not found");
});

let port = process.env.SERVER_PORT;
if (environment == "development") port = process.env.SERVER_PORT_DEV;

/* Starting the server */
app.listen(port, process.env.SERVER_IP, async () => {
  initMySQLDatabase();
  activateWorkerManager();

  if (environment == "development") {
    // insertInitialData();
    generateRandomAESKey();
    logger.info("WORKING IN DEVELOPMENT MODE");
  } else logger.info("WORKING IN PRODUCTION MODE");

  logger.info("Starting server on port " + port);
});

process.on("SIGINT", async () => {
  await closePool();
});