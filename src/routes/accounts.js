const express = require("express");
const router = express.Router();
const logger = require("../internal/functions/logger");
const { encrypt_aes, decrypt_aes } = require("../internal/functions/crypto");
const { executeQuery } = require("../internal/databases/mysql_connector");

/**
 * @swagger
 * /register:
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
 *       '404':
 *         description: Invalid petition, user already exists
 *       '405':
 *         description: Invalid petition, incorrect params
 */
router.post("/register", async (req, res) => {
  let body_parsed = JSON.parse(decrypt_aes(req.body.info, req.body.iv, req.body.authPath));
  //let actual_user =

  /*if (executeQuery("SELECT COUNT(*) FROM USERS_ WHERE user_ = ?", [])) {

  }*/
  //     let [encrypted, itv, authTag] = encrypt_aes("test");

  //   res.status(200).send(
  //     `<h1>Encrypted: ${encrypted}</h1>
  //     <br><h1>Decrypted: ${decrypt_aes(encrypted, itv, authTag)}</h1>`
  //   );
  /*executeQuery("MATCH (n:Parking) RETURN n", "", true).then((data) => {
    //console.log(data[0]._fields.Node);
    console.log(data[0]._fields[0].properties.name);
    return res.status(200).send(data);
  });*/
  /*if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1].includes("undefined")
  )
    return res
      .status(401)
      .send({ code: 401, message: "Token not provided or undefined" });

  if (req.headers.authorization.split(" ")[1] == "1234") {
    executeQuery("MATCH (n:Parking) RETURN n", "", true);
    logger.info("Parkings mandados");
  } else logger.info("Token inválido");*/
  //decode_bearer_token(req.headers.authorization.split(" ")[1]);
});

/**
 * @swagger
 * /getPersonalInfo:
 *   get:
 *     summary: Get personal information of a user
 *     description: Retrieves personal information of a user based on username
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user
 *     responses:
 *       '200':
 *         description: Personal information retrieved successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get("/getPersonalInfo", async (req, res) => {
  let body_parsed = JSON.parse(decrypt_aes(req.body.info, req.body.iv, req.body.authPath));

  try {
    // Fetch personal information of the user
    const personalInfo = await executeQuery("SELECT * FROM users WHERE username = ?", [body_parsed.username]);

    if (personalInfo.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    // Return the personal information
    return res.status(200).send(personalInfo);
  } catch (error) {
    logger.error("Error retrieving personal information:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /getUserFavorites:
 *   get:
 *     summary: Get user's favorite parkings
 *     description: Retrieves the favorite parkings of a user based on user ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       '200':
 *         description: User's favorite parkings retrieved successfully
 *       '404':
 *         description: User's favorite parkings not found
 *       '500':
 *         description: Internal server error
 */
router.get("/getUserFavorites", async (req, res) => {
  let body_parsed = JSON.parse(decrypt_aes(req.body.info, req.body.iv, req.body.authPath));

  try {
    const userFavorites = await executeQuery("SELECT * FROM parkings WHERE id IN (SELECT id_parking FROM user_favorite WHERE id_user = ?)", [body_parsed.id]);

    if (userFavorites.length === 0) {
      return res.status(404).send({ error: "Favorites not found" });
    }

    // Return the user's favorites
    return res.status(200).send(userFavorites);
  } catch (error) {
    logger.error("Error retrieving favorites:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});




module.exports = router;
