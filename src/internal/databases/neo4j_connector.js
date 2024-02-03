const neo4j = require('neo4j-driver');
const logger = require("../functions/logger");
require("dotenv");

let driver;

const initNeo4jDatabase = () => {
	driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
	logger.log("database", `Neo4j: Driver initiated correctly`);
}

function executeQuery(query, params) {
	const session = driver.session({ database: "pamplonapark" });

	return session.readTransaction((tx) =>
		tx.run(query, params))
		.then(result => {
			logger.log("database", `Neo4j: Query executed: ${sql}`);
			return result.records;
		})
		.catch(error => {
			logger.log("database", `Neo4j: Error in query: ${error.message}`);
		})
		.finally(() => {
			return session.close();
		});
}

module.exports = { initNeo4jDatabase, executeQuery };