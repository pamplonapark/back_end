const express = require("express");
const router = express.Router();
const logger = require("../internal/functions/logger");
const { encrypt_aes, decrypt_aes, create_bearer_token, decode_bearer_token } = require("../internal/functions/crypto");
const { Users } = require("../internal/databases/models/Users");

/**
 * @swagger
 * /accounts/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided username, password, and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               info:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     description: The username of the user
 *                   password:
 *                     type: string
 *                     description: The password of the user
 *                   email:
 *                     type: string
 *                     description: The email of the user
 *               iv:
 *                 type: string
 *                 description: The initialization vector for AES decryption
 *               authPath:
 *                 type: string
 *                 description: The authentication path for AES decryption
 *             required:
 *               - info
 *               - iv
 *               - authPath
 *     responses:
 *       '200':
 *         description: User registered and logged in successfully
 *       '430':
 *         description: Invalid petition, incorrect params
 *       '500':
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
  let body = decrypt_aes(req.body.info, req.body.iv, req.body.authPath);

  if (body == undefined) res.status(430).send({ code: 430, message: "Invalid petition, incorrect params" })
  else {
    try {
      let body_parsed = JSON.parse(body)[0];

      if (!body_parsed.email || !body_parsed.password || !body_parsed.username) throw Error("Invalid args (undefined for some args)");

      let [results] = await Users.searchUser(body_parsed.username).catch(() => { throw new Error("Error verifying if user is registered") });

      /* If user do not exist, creates it */
      if (results.length == 0) {
        await Users.registerUser(body_parsed.username, body_parsed.email, body_parsed.password).catch(() => { throw new Error("Error creating user") }).then(async () => {
          let [results] = await Users.searchUser(body_parsed.username, body_parsed.password).catch(() => { throw new Error("Error in query searching user") });

          res.status(200).send({ code: 200, message: "User created and logged correctly", auth: create_bearer_token(results[0].uuid, results[0].password, results[0].username) });
          logger.info(`User created and logged correctly - ${results[0].uuid}`);
        });
      }
      else {
        let [results] = await Users.validateUser(body_parsed.username, body_parsed.password, body_parsed.email).catch(() => { throw new Error("Error verifying if user is registered") });

        if (results.length == 0) res.status(430).send({ code: 430, message: "Invalid credentials: User / Password" });
        else {
          res.status(200).send({ code: 200, message: "User logged correctly", auth: create_bearer_token(results[0].uuid, results[0].password, results[0].username) });
          logger.info(`User logged correctly - ${results[0].uuid}`);
        }
      }
    } catch (error) {
      res.status(500).send({ code: 500, message: "Internal server error - Contact an administrator" });
      logger.error(error.message + " for IP - " + req.socket.remoteAddress);
    }
  }
});

/**
 * @swagger
 * /accounts/getPersonalInfo:
 *   get:
 *     summary: Get Personal Information
 *     description: Retrieves personal information of the user
 *     responses:
 *       '200':
 *         description: User's personal information retrieved successfully
 *       '430':
 *         description: Invalid authorization key
 *       '500':
 *         description: Internal server error
 */
router.get("/getPersonalInfo", async (req, res) => {
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
        let [results] = await Users.searchByAuth(data_from_bearer.username, data_from_bearer.uuid).catch(() => { throw new Error("Error in query searching user") });
        let [data_encrypted, iv, authPath] = encrypt_aes(JSON.stringify(results[0]));

        res.status(200).send({ code: 200, message: "User retrieved correctly", info: data_encrypted, iv: iv.toString("hex"), authPath: authPath.toString("hex") });
        logger.info(`User retrieved correctly - ${results[0].uuid}`);
      } catch (error) {
        res.status(500).send({ code: 500, message: "Internal server error - Contact an administrator" });
        logger.error(error.message + " for IP - " + req.socket.remoteAddress);
      }
    }
  }
});

/**
 * @swagger
 * /accounts/getUserFavorites:
 *   get:
 *     summary: Get user's favorite parkings
 *     description: Retrieves the favorite parkings of a user based on user UUID
 *     responses:
 *       '200':
 *         description: User's favorite parkings retrieved successfully
 *       '404':
 *         description: No parkings found for the user
 *       '430':
 *         description: Invalid authorization key
 *       '500':
 *         description: Internal server error
 */
router.get("/getUserFavorites", async (req, res) => {
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
        let [results] = await Users.getFavorites(data_from_bearer.uuid).catch(() => { throw new Error("Error in query searching user_Fav") });

        if (results[0] != undefined) {
          let [data_encrypted, iv, authPath] = encrypt_aes(JSON.stringify(results[0]));

          res.status(200).send({ code: 200, message: "User_Fav retrieved correctly", info: data_encrypted, iv: iv.toString("hex"), authPath: authPath.toString("hex") });
          logger.info(`User_Fav retrieved correctly - ${data_from_bearer.uuid}`);
        }
        else res.status(404).send({ code: 404, message: "No parkings found for this user" });
      } catch (error) {
        res.status(500).send({ code: 500, message: "Internal server error - Contact an administrator" });
        logger.error(error.message + " for IP - " + req.socket.remoteAddress);
      }
    }
  }
});

module.exports = router;
