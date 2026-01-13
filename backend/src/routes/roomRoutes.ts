import { Router } from "express";
import { roomController } from "../controllers/RoomController";
import { fileController } from "../controllers/FileController";
import {
  validateRoomCode,
  validateFilenameParam,
} from "../middlewares/validation";
import {
  ensureRoomExists,
  ensureRoomDirectory,
} from "../middlewares/roomExists";
import { upload } from "../config/multer";
import {
  roomCreationRateLimit,
  fileUploadRateLimit,
} from "../middlewares/rateLimiter";

const router = Router();

router.get("/time", roomController.getServerTime.bind(roomController));

router.post(
  "/rooms",
  roomCreationRateLimit,
  roomController.createRoom.bind(roomController)
);

router.get(
  "/rooms/:code",
  validateRoomCode,
  ensureRoomExists,
  roomController.getRoomDetails.bind(roomController)
);

router.get(
  "/rooms/:code/files",
  validateRoomCode,
  ensureRoomExists,
  roomController.getFiles.bind(roomController)
);

router.post(
  "/rooms/:code/upload",
  validateRoomCode,
  ensureRoomExists,
  ensureRoomDirectory,
  fileUploadRateLimit,
  upload.single("file"),
  fileController.uploadFile.bind(fileController)
);

router.get(
  "/rooms/:code/files/:filename",
  validateRoomCode,
  validateFilenameParam,
  ensureRoomExists,
  fileController.downloadFile.bind(fileController)
);

export default router;
