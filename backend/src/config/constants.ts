import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  UPLOAD_DIR: path.resolve(process.env.UPLOAD_DIR || "./uploads"),
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "104857600", 10),
  ROOM_EXPIRATION_MS:
    parseInt(process.env.ROOM_EXPIRATION_MINUTES || "30", 10) * 60 * 1000,
  CLEANUP_INTERVAL_MS:
    parseInt(process.env.CLEANUP_INTERVAL_SECONDS || "60", 10) * 1000,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGIN
    ? [process.env.ALLOWED_ORIGIN, "http://localhost:5173"]
    : ["http://localhost:5173"],
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  GONE: 410,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  ROOM_NOT_FOUND: "Room not found",
  ROOM_EXPIRED: "Room has expired",
  FILE_NOT_FOUND: "File not found",
  FILE_TOO_LARGE: "File size exceeds maximum allowed",
  INVALID_ROOM_CODE: "Invalid room code format",
  UPLOAD_FAILED: "File upload failed",
} as const;
