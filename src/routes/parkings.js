const express = require("express");
const router = express.Router();
const logger = require("../internal/functions/logger");
const { decode_bearer_token } = require("../internal/functions/crypto");
const { Parkings } = require("../internal/databases/models/Parkings");

/**
 * @swagger
 * /parkings/getAll:
 *   get:
 *     summary: Get all parkings
 *     description: Retrieves information about all parkings
 *     responses:
 *       '200':
 *         description: Parkings retrieved successfully
 *       '404':
 *         description: No parkings found
 *       '430':
 *         description: Invalid authorization key
 *       '500':
 *         description: Internal server error
 */
router.post("/getAll", async (req, res) => {
  let body = req.body.auth//decrypt_aes(req.body.auth, req.body.iv, req.body.authPath);

  if (body == undefined) res.status(430).send({ code: 430, message: "Invalid petition, incorrect params" })
  else {
    try {
      let body_parsed = JSON.parse(body)[0];

      if (!body_parsed.auth) throw Error("Invalid args (undefined for some args)");

      let token = body_parsed.auth;

      if (process.env.NODE_ENV == "development") token = process.env.DEFAULT_BEARER;

      let data_from_bearer = decode_bearer_token(token);

      if (data_from_bearer == undefined) {
        res.status(430).send({ code: 430, message: "Invalid Bearer token" });
        logger.error("Impossible to decode Bearer Token for IP - " + req.socket.remoteAddress);
      }
      else {
        let [results] = await Parkings.getAll().catch(() => { throw new Error("Error in query searching all parkings") });

        if (results[0] != undefined) {
          res.status(200).send({ code: 200, message: "Parkings retrieved correctly", info: JSON.stringify(results) });
          logger.info(`Parkings retrieved correctly`);
        }
        else res.status(404).send({ code: 404, message: "No parkings found, please try again later" });
      }
    } catch (error) {
      res.status(500).send({ code: 500, message: "Internal server error - Contact an administrator" });
      logger.error(error.message + " for IP - " + req.socket.remoteAddress);
    }
  }
});

/**
 * @swagger
 * /parkings/getByUUID:
 *   get:
 *     summary: Get parking by UUID
 *     description: Retrieves information about a parking by its UUID
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: The UUID of the parking
 *     responses:
 *       '200':
 *         description: Parking retrieved successfully
 *       '404':
 *         description: No parking found
 *       '430':
 *         description: Invalid authorization key
 *       '500':
 *         description: Internal server error
 */
router.get("/getByUUID", async (req, res) => {
  let body = req.body.auth//decrypt_aes(req.body.auth, req.body.iv, req.body.authPath);

  if (body == undefined) res.status(430).send({ code: 430, message: "Invalid petition, incorrect params" })
  else {
    try {
      let body_parsed = JSON.parse(body)[0];

      if (!body_parsed.auth) throw Error("Invalid args (undefined for some args)");

      let token = body_parsed.auth;

      if (process.env.NODE_ENV == "development") token = process.env.DEFAULT_BEARER;

      let data_from_bearer = decode_bearer_token(token);

      if (data_from_bearer == undefined) {
        res.status(430).send({ code: 430, message: "Invalid Bearer token" });
        logger.error("Impossible to decode Bearer Token for IP - " + req.socket.remoteAddress);
      }
      else if (req.query.uuid == undefined) res.status(430).send({ code: 430, message: "You have to add a uuid" });
      else {
        let [results] = await Parkings.getByUUID(req.query.uuid).catch(() => { throw new Error("Error in query searching all parkings") });

        if (results[0] != undefined) {
          res.status(200).send({ code: 200, message: "Parking retrieved correctly", info: JSON.stringify(results) });
          logger.info(`Parking retrieved correctly - ${req.query.uuid}`);
        }
        else res.status(404).send({ code: 404, message: "No parkings found, please try again later" });
      }
    } catch (error) {
      res.status(500).send({ code: 500, message: "Internal server error - Contact an administrator" });
      logger.error(error.message + " for IP - " + req.socket.remoteAddress);
    }
  }
});

/**
 * @swagger
 * /parkings/getPriceByUUID:
 *   get:
 *     summary: Get price by UUID
 *     description: Retrieves parking prices by UUID
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: The UUID of the parking
 *     responses:
 *       '200':
 *         description: Parking prices retrieved successfully
 *       '404':
 *         description: No parking found
 *       '430':
 *         description: Invalid authorization key
 *       '500':
 *         description: Internal server error
 */
router.get("/getPriceByUUID", async (req, res) => {
  let body = req.body.auth//decrypt_aes(req.body.auth, req.body.iv, req.body.authPath);

  if (body == undefined) res.status(430).send({ code: 430, message: "Invalid petition, incorrect params" })
  else {
    try {
      let body_parsed = JSON.parse(body)[0];

      if (!body_parsed.auth) throw Error("Invalid args (undefined for some args)");

      let token = body_parsed.auth;

      if (process.env.NODE_ENV == "development") token = process.env.DEFAULT_BEARER;

      let data_from_bearer = decode_bearer_token(token);

      if (data_from_bearer == undefined) {
        res.status(430).send({ code: 430, message: "Invalid Bearer token" });
        logger.error("Impossible to decode Bearer Token for IP - " + req.socket.remoteAddress);
      }
      else if (req.query.uuid == undefined) res.status(430).send({ code: 430, message: "You have to add a uuid" });
      else {
        let [results] = await Parkings.getPriceByUUID(req.query.uuid).catch(() => { throw new Error("Error in query searching all parkings prices") });

        if (results[0] != undefined) {
          res.status(200).send({ code: 200, message: "Parking prices retrieved correctly", info: JSON.stringify(results) });
          logger.info(`Parking prices retrieved correctly - ${req.query.uuid}`);
        }
        else res.status(404).send({ code: 404, message: "No parkings found, please try again later" });
      }
    } catch (error) {
      res.status(500).send({ code: 500, message: "Internal server error - Contact an administrator" });
      logger.error(error.message + " for IP - " + req.socket.remoteAddress);
    }
  }
});

module.exports = router;
