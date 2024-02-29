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
  let body_parsed = decrypt_aes(req.body.info, req.body.iv, req.body.authPath);

  if (executeQuery("SELECT COUNT(*) FROM USERS_ WHERE user_ = ?", [])) { }
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

module.exports = router;
