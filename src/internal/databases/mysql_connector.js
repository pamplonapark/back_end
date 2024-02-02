const mysql = require("mysql2");
const logger = require("../functions/logger");
require("dotenv");

let pool;

const initDatabase = () => {
  pool = mysql.createPool({
    connectionLimit: 50,
    host: "localhost",
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "pamplonapark_users",
  });
};

const executeQuery = (sql) => {
  let connection = pool.getConnection((err, connection) => {
    if (err) logger.error("Error al obtener la conexión del pool: ", err);
    else logger.info("Pool creada correctamente");
  });

  connection.query(sql, (err, results, fields) => {
    if (err) {
      logger.error("Error en la consulta: ", err);
    } else {
      logger.log("Resultados de la consulta: ", results);
    }

    connection.release();
  });
};

module.exports = { initDatabase, executeQuery };
