import multer from "multer";
import path from "path";
import { CONFIG } from "./constants";
import { fileService } from "../services/FileService";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const code = _req.params.code;
    const roomDir = fileService.getRoomDirectory(code);
    cb(null, roomDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  _file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: CONFIG.MAX_FILE_SIZE,
  },
  fileFilter,
});
