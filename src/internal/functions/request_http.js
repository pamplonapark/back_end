const http = require("http");

/* REGISTER */
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
      console.log(err);
      reject(err);
    });

    request.end();
  });
};

module.exports = requestHTTP;
