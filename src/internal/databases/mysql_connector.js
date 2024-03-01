const mysql = require("mysql2");
const logger = require("../functions/logger");

let pool;

/**
 * Initializes MySQL database connection pool.
 * It sets up event listeners for connection queue, acquisition, and release.
 * Additionally, it tests the connection to ensure its correctness.
 * 
 * @returns {Pool} The MySQL connection pool.
 */
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

  return pool;
};
/**
 * Executes a SQL query using the provided pool or the default one if not specified.
 * 
 * @param {string} sql - The SQL query to execute.
 * @param {Array} values - Values to be inserted into the query.
 * @param {Pool} [sub_pool=null] - Optional: The MySQL connection pool to use.
 * @returns {Promise<Array>} A promise that resolves with an array containing the results and fields of the executed query.
 */
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

/**
 * Asynchronously closes the MySQL connection pool.
 * 
 * @param {Pool} [sub_pool=null] - Optional: The MySQL connection pool to close.
 *                                If not provided, the default pool will be used.
 * @returns {Promise<void>} A promise that resolves when the connection pool is closed.
 */
const closePool = async (sub_pool = null) => {
  let tem_pool = sub_pool;

  if (tem_pool == null) tem_pool = pool;

  await tem_pool.end((err) => {
    if (err) logger.log("error", "Error closing pool - " + err);
    else logger.log("database", "Pool closed correctly");
  });
};

module.exports = { initMySQLDatabase, executeQuery, closePool };
