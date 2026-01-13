import winston from "winston";
import path from "path";

// Create logs directory path
const logsDir = path.join(process.cwd(), "logs");

// Configure Winston logger
const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "tempshare-backend" },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write only errors to error.log
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If not in production, also log to console
if (process.env.NODE_ENV !== "production") {
  winstonLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
          let msg = `[${timestamp}] [${level}] ${message}`;
          if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
          }
          return msg;
        })
      ),
    })
  );
}

export class Logger {
  static info(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.info(message, meta);
  }

  static warn(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.warn(message, meta);
  }

  static error(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.error(message, meta);
  }

  static debug(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.debug(message, meta);
  }
}
