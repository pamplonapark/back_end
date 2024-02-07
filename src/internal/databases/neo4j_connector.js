const neo4j = require("neo4j-driver");
const logger = require("../functions/logger");
require("dotenv").config();

let driver;

const initNeo4jDatabase = async () => {
  try {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );
    const serverInfo = await driver.getServerInfo();

    logger.log(
      "database",
      `Neo4j: Driver initiated correctly. Agent: ${serverInfo.agent} - Protocol version: ${serverInfo.protocolVersion}`
    );
  } catch (err) {
    logger.log(
      "error",
      `Error stablishing connection to Neo4j server - ${err} - Cause: ${err.cause}`
    );
    logger.log(
      "database",
      `Error stablishing connection to Neo4j server - ${err} - Cause: ${err.cause}`
    );
  }
};

/**
 * @param query : Query (String)
 * @param params : Parameters (Object)
 * @param printError : Print if error or not (Boolean)
 */
const executeQuery = (query, params, printError = true) => {
  const session = driver.session({ database: "pamplonapark" });

  return session
    .readTransaction((tx) => tx.run(query, params))
    .then((result) => {
      logger.log("database", `Neo4j: Query executed: ${sql}`);
      return result.records;
    })
    .catch((error) => {
      if (!printError) {
        logger.log("database", `Neo4j: Error in query: ${error.message}`);
        logger.error(`Neo4j: Error in query: ${error.message}`);
      }
    })
    .finally(() => {
      return session.close();
    });
};

/**
 * @param query : Query (String)
 * @param params : Parameters (Object)
 */
const insertQuery = (query, params) => {
  const session = driver.session();

  return session
    .writeTransaction((tx) => tx.run(query, params))
    .then((result) => {
      logger.log("database", `Neo4j: Query executed: ${query}`);
      return result.records;
    })
    .catch((error) => {
      logger.log("database", `Neo4j: Error in query: ${error.message}`);
    })
    .finally(() => {
      return session.close();
    });
};

module.exports = { initNeo4jDatabase, executeQuery, insertQuery };
