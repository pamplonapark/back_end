const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./src/internal/functions/logger");
const app = express();
require("dotenv").config();
const { initMySQLDatabase } = require("./src/internal/databases/mysql_connector");
const { initNeo4jDatabase } = require("./src/internal/databases/neo4j_connector");

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

//app.use("/account/v1", require("./src/routes/account.js"));

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
app.listen(process.env.SERVER_PORT, process.env.SERVER_IP, () => {
  initMySQLDatabase();
  initNeo4jDatabase();

  logger.info("Starting server on port " + process.env.SERVER_PORT);
});
