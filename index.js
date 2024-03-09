const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./src/internal/functions/logger");
const app = express();
const { initMySQLDatabase, closePool } = require("./src/internal/databases/mysql_connector");
const activateWorkerManager = require("./src/internal/functions/WorkerManager.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger-config.js");
const basicAuth = require('express-basic-auth');
const { insertInitialData } = require("./src/internal/functions/updateUndergroundParkings");

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
app.use("/v1/docs", basicAuth({ users: { "admin": process.env.ADMIN_PASSWORD }, challenge: true }), swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true, customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css" })); // Route for Swagger docs

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

/* Starting the server */
app.listen(process.env.SERVER_PORT, process.env.SERVER_IP, async () => {
  initMySQLDatabase();
  activateWorkerManager();

  if (process.env.NODE_ENV == "development") {
    insertInitialData()
    logger.info("WORKING IN DEVELOPMENT MODE");
  } else logger.info("WORKING IN PRODUCTION MODE");

  logger.info("Starting server on port " + process.env.SERVER_PORT);
});

process.on("SIGINT", async () => {
  await closePool();
});