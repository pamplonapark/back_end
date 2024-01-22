// const requestHTTP = require('../functions/requests');
const xml2js = require('xml2js');
const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

const parseXMLData = async (data) => {
    const parser = new xml2js.Parser({ attrkey: "ATTR" });
    parser.parseString(data, async function(error, result) {
        if (error) {
            console.error(`Error parsing XML: ${error}`);
        } else {
            const jsonString = JSON.stringify(result, null, 1);
            await writeFile('xml.json', jsonString);
            console.log('JSON file has been written');
        }
    });
};

// const x = async () => {
//     let data = await requestHTTP(
//       "parkings.pamplona.es",
//       "/parkings.xml",
//       "GET",
//       { accept: "text/xml" }
//     );
//     console.log(data);
//     parseXMLData(data);
// };

// x();