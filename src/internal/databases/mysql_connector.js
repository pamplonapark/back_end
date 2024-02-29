const mysql = require("mysql2");
const logger = require("../functions/logger");

let pool;

const initMySQLDatabase = () => {
  // If pool exists
  if (pool) {
    pool.removeListener("enqueue");
    pool.removeListener("acquire");
    pool.removeListener("release");
  }

  let mysql_user = process.env.MYSQL_USER;
  let mysql_password = process.env.MYSQL_PASSWORD;
  let mysql_port = process.env.MYSQL_PORT;

  if (process.env.ENVIRONMENT == "development") {
    mysql_user = process.env.MYSQL_USER_DEV;
    mysql_password = process.env.MYSQL_PASSWORD_DEV;
    mysql_port = process.env.MYSQL_PORT_DEV;
  }

  pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    port: mysql_port,
    user: mysql_user,
    password: mysql_password,
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

  return pool;
};

const executeQuery = (sql, values, sub_pool = null) => {
  let tem_pool = sub_pool;

  if (!tem_pool) tem_pool = pool;

  return new Promise(async (resolve, reject) => {
    tem_pool.getConnection((err, connection) => {
      if (err) logger.log("error", "Error in database connection: " + err);

      connection.execute(sql, values, (err, results, fields) => {
        connection.release();

        if (err) reject(logger.log("error", "Error in SQL execute - " + err));
        else {
          logger.log("database", "Query executed correctly - " + sql);
          resolve([results, fields]);
        }
      });
    });
  });
};

const closePool = (sub_pool = null) => {
  let tem_pool = sub_pool;

  if (tem_pool == null) tem_pool = pool;

  tem_pool.end((err) => {
    if (err) logger.log("error", "Error closing pool - " + err);
    else logger.log("database", "Pool closed correctly");
  });
};

module.exports = { initMySQLDatabase, executeQuery, closePool };
