const xml2js = require("xml2js");

const parseXMLData = async (data) => {
  const parser = new xml2js.Parser({ attrkey: "ATTR" });

  parser.parseString(data, async function (error, result) {
    if (error) {
      console.error(`Error parsing XML: ${error}`);
    } else {
      return JSON.stringify(result);
    }
  });
};

module.exports = parseXMLData;
