const express = require("express");
const router = express.Router();
const logger = require("../internal/functions/logger");
const { decode_bearer_token } = require("../internal/functions/crypto");
const { Parkings } = require("../internal/databases/models/Parkings");
/**
 * @swagger
 * /parkings/getAll:
 *   post:
 *     summary: Creates a new user / log in a user
 *     description: Creates a user / log in a user
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password in SHA-512
 *     responses:
 *       '200':
 *         description: Creates the user and / or returns a Bearer token
 *       '430':
 *         description: Invalid petition, incorrect params
 *       '500':
 *         description: Internal server error
 */
router.get("/getAll", async (req, res) => {
  let token = req.headers.authorization;

  if (process.env.NODE_ENV == "development") token = process.env.DEFAULT_BEARER;

  if (req.headers.authorization == undefined || req.headers.authorization.split(" ")[1] == undefined) res.status(430).send({ code: 430, message: "You have to add an authorization key" });
  else {
    let data_from_bearer = decode_bearer_token(token, req);

    if (data_from_bearer == undefined) {
      res.status(430).send({ code: 430, message: "Invalid Bearer token" });
      logger.error("Impossible to decode Bearer Token for IP - " + req.socket.remoteAddress);
    }
    else {
      try {
        let [results] = await Parkings.getAll().catch(() => { throw new Error("Error in query searching all parkings") });

        if (results[0] != undefined) {
          res.status(200).send({ code: 200, message: "Parkings retrieved correctly", info: JSON.stringify(results) });
          logger.info(`Parkings retrieved correctly`);
        }
        else res.status(404).send({ code: 404, message: "No parkings found, please try again later" });
      } catch (error) {
        res.status(500).send({ code: 500, message: "Internal server error - Contact an administrator" });
        logger.error(error.message + " for IP - " + req.socket.remoteAddress);
      }
    }
  }
});

/**
 * @swagger
 * /parkings/getByUUID:
 *   post:
 *     summary: Creates a new user / log in a user
 *     description: Creates a user / log in a user
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password in SHA-512
 *     responses:
 *       '200':
 *         description: Creates the user and / or returns a Bearer token
 *       '430':
 *         description: Invalid petition, incorrect params
 *       '500':
 *         description: Internal server error
 */
router.get("/getByUUID", async (req, res) => {
  let token = req.headers.authorization;

  if (process.env.NODE_ENV == "development") token = process.env.DEFAULT_BEARER;

  if (req.headers.authorization == undefined || req.headers.authorization.split(" ")[1] == undefined) res.status(430).send({ code: 430, message: "You have to add an authorization key" });
  else {
    let data_from_bearer = decode_bearer_token(token, req);

    if (data_from_bearer == undefined) {
      res.status(430).send({ code: 430, message: "Invalid Bearer token" });
      logger.error("Impossible to decode Bearer Token for IP - " + req.socket.remoteAddress);
    }
    else if (req.query.uuid == undefined) res.status(430).send({ code: 430, message: "You have to add a uuid" });
    else {
      try {
        let [results] = await Parkings.getByUUID(req.query.uuid).catch(() => { throw new Error("Error in query searching all parkings") });

        if (results[0] != undefined) {
          res.status(200).send({ code: 200, message: "Parking retrieved correctly", info: JSON.stringify(results) });
          logger.info(`Parking retrieved correctly - ${req.query.uuid}`);
        }
        else res.status(404).send({ code: 404, message: "No parkings found, please try again later" });
      } catch (error) {
        res.status(500).send({ code: 500, message: "Internal server error - Contact an administrator" });
        logger.error(error.message + " for IP - " + req.socket.remoteAddress);
      }
    }
  }
});

module.exports = router;
