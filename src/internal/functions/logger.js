const winston = require("winston");
const { combine, timestamp, printf, colorize, align } = winston.format;

winston.addColors({
  database: "cyan",
  info: "green",
  error: "red"
});

const logger = winston.createLogger({
  levels: {
    ...winston.config.npm.levels,
    database: 1
  },
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: '${info.message.trim()}'`)
  ),
  transports: [
    new winston.transports.Console({ // Remove in production
      format: combine(
        colorize(),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: '${info.message.trim()}'`)
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/database.log",
      level: "database",
    }),
    new winston.transports.File({
      filename: "logs/combined.log"
    }),
  ],
});

module.exports = logger;
