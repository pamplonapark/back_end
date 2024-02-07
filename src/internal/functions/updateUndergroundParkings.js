const parseXMLData = require("../readers/reader_xml");
const { requestHTTP } = require("./requests");
const fs = require("fs");
const path = require("path");
const { parentPort } = require("worker_threads");
const { insertQuery } = require("../databases/neo4j_connector");

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

  jsonData.aparcamientos.aparcamiento.forEach((element) => {
    insertQuery(
      "CREATE (:Parking:Underground {id: $id, name: $name, address: $address, telephone: $telephone, latitude: $latitude, longitude: $longitude, hours_active: $hours_active, spots: $spots, available_spots: $available_spots})",
      {
        id: element.codigo[0],
        name: element.nombre[0],
        address: element.direccion[0],
        telephone: element.telefono[0],
        latitude: element.latitud[0],
        longitude: element.longitud[0],
        hours_active:
          element.horario[0].desde + " - " + element.horario[0].hasta,
        spots: element.plazas[0].total[0],
        available_spots: element.plazas[0].libres[0],
      },
      false
    );
  });

  // Notify the main thread about the completion
  parentPort.postMessage("Parkings updated correctly");
};

updateUndergroundParkings();
