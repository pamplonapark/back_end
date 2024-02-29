const parseXMLData = require("../readers/reader_xml");
const { requestHTTP } = require("./requests");
const fs = require("fs");
const path = require("path");
const { parentPort } = require("worker_threads");
const logger = require("./logger");
const {
  executeQuery,
  initMySQLDatabase,
  closePool,
} = require("../databases/mysql_connector");

const updateDataMySQL = async (element) => {
  return new Promise(async (resolve) => {
    resolve(
      await executeQuery(
        "UPDATE Parkings SET hours_active = ?, spots = ?, available_spots = ? WHERE id = ?",
        [
          element.horario[0].desde + " - " + element.horario[0].hasta,
          element.plazas[0].total[0],
          element.plazas[0].libres[0],
          element.codigo[0],
        ]
      )
    );
  });
};

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

  let pool = initMySQLDatabase();

  const insertData = jsonData.aparcamientos.aparcamiento.map(
    async (element) => {
      await updateDataMySQL(element, pool);
    }
  );

  await Promise.all(insertData);

  closePool(pool);
  parentPort.postMessage("Parkings updated correctly");
};

const insertInitialData = async () => {
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

  const insertData = jsonData.aparcamientos.aparcamiento.map(
    async (element) => {
      return new Promise(async (resolve) => {
        resolve(
          await executeQuery(
            "INSERT IGNORE INTO Parkings(id, name, address, hours_active, spots, available_spots, latitude, longitude, telephone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              element.codigo[0],
              element.nombre[0],
              element.direccion[0],
              element.horario[0].desde + " - " + element.horario[0].hasta,
              element.plazas[0].total[0],
              element.plazas[0].libres[0],
              element.latitud[0],
              element.longitud[0],
              element.telefono[0],
            ]
          )
        );
      });
    }
  );

  await Promise.all(insertData);
};

if (parentPort != null) updateUndergroundParkings();

module.exports = { insertInitialData };
