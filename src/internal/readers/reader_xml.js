const xml2js = require("xml2js");
const { logger } = require("../functions/logger");

const parseXMLData = async (data) => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({ attrkey: "ATTR" });

    parser.parseString(data, (error, result) => {
      if (error) {
        logger.error(`Error parsing XML input: ${error}`);
        reject();
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = parseXMLData;
