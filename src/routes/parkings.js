const express = require("express");
const router = express.Router();
// const {
//   create_bearer_token,
//   decode_bearer_token,
// } = require("../internal/database/server/auth_bearer");
// const { Users } = require("../internal/database/server/User");
const logger = require("../internal/functions/logger");

router.get("/getAllParkings", async (req, res) => {
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
