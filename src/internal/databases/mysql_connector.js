const mysql = require("mysql2");
const logger = require("../functions/logger");
require("dotenv");

let pool;

const initMySQLDatabase = () => {
  // If pool exists
  if (pool) {
    pool.removeListener("enqueue");
    pool.removeListener("acquire");
    pool.removeListener("release");
  }

  pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    charset: "utf8mb4",
    connectTimeout: 10000,
    dateStrings: false,
    database: "pamplonapark",
    queueLimit: 0, // No limit regarding queued connections -> Auto handler for multiple requests at once
  });

  pool.on("enqueue", () => {
    logger.log("database", `Connection in queue`);
  });

  pool.on("acquire", (connection) => {
    logger.log("database", `Connection ${connection.threadId} acquired`);
  });

  pool.on("release", (connection) => {
    logger.log(
      "database",
      `Connection ${connection.threadId} returned to the pool`
    );
  });

  // Test correct MySQL connection
  pool.getConnection((err, connection) => {
    if (err || connection == null) {
      logger.log("error", `Error stablishing pool - ${err}`);
      logger.log("database", `Error stablishing pool - ${err}`);
    } else {
      logger.log("database", `Connection to database stablished correctly`);

      connection.release();
    }
  });
};

const executeQuery = (sql, values) => {
  pool.getConnection((err, connection) => {
    if (err) logger.log("error", "Error in database connection: " + err);

    connection.execute(sql, values, (err, results, fields) => {
      connection.release();

      if (err) logger.log("error", "Error in SQL execute - " + err);
      else {
        logger.log("database", "Query executed correctly - " + sql);
        return [results, fields];
      }
      return;
    });
  });
};

const closePool = () => {
  pool.end((err) => {
    if (err) logger.log("error", "Error closing pool - " + err);
    else logger.log("database", "Pool closed correctly");
  });
};

module.exports = { initMySQLDatabase, executeQuery, closePool };
