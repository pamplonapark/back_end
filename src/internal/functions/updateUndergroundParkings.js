const parseXMLData = require("../readers/reader_xml");
const { requestHTTP } = require("./requests");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const { parentPort } = require("worker_threads");

/**
 * Get underground parking and parsing to JSON
 * */
const updateUndergroundParkings = async () => {
  const data = await requestHTTP(
    "parkings.pamplona.es",
    "/parkings.xml",
    "GET",
    "" /* Without headers, website do not allow them */
  );

  // Sanitizing output -> Removing first line (<?xml...?>), removing all bad-formated characters && lower case everything (better object access)
  const cleanedData = data.replace(/[^\x20-\x7E]/g, "");
  const cleanedData2 = cleanedData
    .substring(39, cleanedData.length)
    .toLowerCase();

  const jsonData = await parseXMLData(cleanedData2);

  fs.writeFileSync(
    path.join("src/internal/databases/src/parkings_underground.json"),
    JSON.stringify(jsonData)
  );

  // Notify the main thread about the completion
  parentPort.postMessage("Parkings updated correctly");
};

updateUndergroundParkings();
