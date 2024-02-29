const xml2js = require("xml2js");
const { logger } = require("../functions/logger");

/**
 * Parses XML data into a JavaScript object.
 * 
 * @param {string} data - The XML data to parse.
 * @returns {Promise<Object>} A promise that resolves with the parsed JavaScript object.
 */
const parseXMLData = async (data) => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({ attrkey: "ATTR" });

    parser.parseString(data, (error, result) => {
      if (error) {
        logger.error(`Error parsing XML input: ${error.stack}`);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = parseXMLData;
