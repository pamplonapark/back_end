const http = require("http");
const logger = require("./logger");

/**
 * Sends an HTTP request to the specified host and path.
 * 
 * @param {string} host - The host to send the request to.
 * @param {string} path - The path of the request.
 * @param {string} method - The HTTP method (e.g., GET, POST, PUT, DELETE).
 * @param {Object} [headers={ accept: "application/json", "Content-Type": "application/json" }] - Optional: Headers for the HTTP request.
 * @returns {Promise<string>} A promise that resolves with the response data.
 */
const requestHTTP = (
  host,
  path,
  method,
  headers = { accept: "application/json", "Content-Type": "application/json" }
) => {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        host: host,
        path: path,
        method: method,
        headers: headers,
      },
      (response) => {
        let chunks = [];
        response.on("data", (data) => chunks.push(data));

        response.on("end", () => {
          resolve(Buffer.concat(chunks).toString());
        });
      }
    );

    request.on("error", (err) => {
      logger.error(`Error creating HTTP connection: ${err.stack}`);
      reject(err);
    });

    request.end();
  });
};

module.exports = { requestHTTP };
