const logger = require("./logger");
const { Worker } = require("worker_threads");

const activateWorkerManager = () => {
  logger.info("Worker Manager activated");

  const createUndergroundParkingUpdaterWorker = () => {
    const worker = new Worker(
      "./src/internal/functions/updateUndergroundParkings.js",
      {
        name: "Parking Updater",
      }
    );

    if (worker != null)
      logger.info(
        "WorkerManager - Worker created correctly (updateUndergroundParkings)"
      );

    worker.on("message", (message) => {
      logger.info(`WorkerManager - Received message from worker: ${message}`);
    });

    worker.on("error", (error) => {
      logger.error(`WorkerManager - Error in worker: ${error.message}`);
    });

    worker.on("exit", (code) => {
      logger.info(
        `WorkerManager - Worker exit status: ${
          code == 0 ? "Successful" : "Error"
        }`
      );
    });
  };

  setInterval(() => {
    createUndergroundParkingUpdaterWorker();
  }, 300000); //5 minutes in milliseconds
};

module.exports = activateWorkerManager;
