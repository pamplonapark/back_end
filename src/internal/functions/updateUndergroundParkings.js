const parseXMLData = require("../readers/reader_xml");
const { requestHTTP } = require("./requests");
const fs = require("fs");
const path = require("path");
const { parentPort } = require("worker_threads");
const {
  executeQuery,
  initMySQLDatabase,
  closePool,
} = require("../databases/mysql_connector");

/**
 * Updates the data of a parking lot in the MySQL database.
 * 
 * @param {Object} element - The parking lot data to be updated.
 * @returns {Promise<Array>} A promise that resolves with the result of the database update query.
 */
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

/**
 * Updates the data of underground parkings in MySQL database.
 * Retrieves data from an XML source, parses it, and updates the database accordingly.
 * 
 * @returns {Promise<void>} A promise that resolves when the update process is complete.
 */
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

/**
 * @deprecated - Dev only
 * Inserts initial data (Parkings and parking prices)
 */
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
      new Promise(async (resolve) => {
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
      }).then(() => {
        console.log("Parking reviewed: " + element.codigo[0])
        element.tarifas[0].rango.map((prices) => {
          new Promise(async (resolve) => {
            prices.importe[0] = prices.importe[0].replace(",", ".")
            resolve(
              await executeQuery(
                "INSERT IGNORE INTO Parkings_Prices(id_parking, code, description, amount) VALUES (?, ?, ?, ?)",
                [
                  element.codigo[0],
                  prices.codigo[0],
                  prices.descripcion[0],
                  prices.importe[0]
                ]
              )
            );
          });
        })
      })
    });

  await Promise.all(insertData);
};

/**
 * Updates the data of underground parkings in MySQL database if executed in a worker thread.
 */
if (parentPort != null) updateUndergroundParkings();

module.exports = { insertInitialData };
