const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./src/internal/functions/logger");
const app = express();
const {
  initMySQLDatabase,
} = require("./src/internal/databases/mysql_connector");
const activateWorkerManager = require("./src/internal/functions/WorkerManager.js");
const { generateRandomAESKey } = require("./src/internal/functions/crypto");
require("dotenv").config({ path: `${__dirname}/config.env`, override: true });

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "jade");
app.use("/parkings", require("./src/routes/parkings.js"));
app.use("/accounts", require("./src/routes/accounts.js"));

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

if (process.env.ENVIRONMENT == "development") port = process.env.SERVER_PORT_DEV;

/* Starting the server */
app.listen(port, process.env.SERVER_IP, async () => {
  initMySQLDatabase();
  activateWorkerManager();

  if (process.env.ENVIRONMENT == "development") {
    // insertInitialData();
    generateRandomAESKey();
    logger.info("WORKING IN DEVELOPMENT MODE");
  } else logger.info("WORKING IN PRODUCTION MODE");

  logger.info("Starting server on port " + port);
});
