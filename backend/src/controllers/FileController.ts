import { Request, Response, NextFunction } from "express";
import { fileService } from "../services/FileService";
import { roomService } from "../services/RoomService";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants";

export class FileController {
  async uploadFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.params;
      const file = req.file;

      if (!file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ERROR_MESSAGES.UPLOAD_FAILED,
        });
        return;
      }

      const fileMetadata = await fileService.addFileToRoom(code, file);

      res.status(HTTP_STATUS.CREATED).json({
        file: fileMetadata,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async downloadFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code, filename } = req.params;
      const room = roomService.getRoom(code);

      if (!room) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.ROOM_NOT_FOUND,
        });
        return;
      }

      const fileMetadata = room.files.find((f) => f.filename === filename);
      if (!fileMetadata) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.FILE_NOT_FOUND,
        });
        return;
      }

      const filePath = fileService.getFilePath(code, filename);
      res.download(filePath, fileMetadata.originalName);
    } catch (error) {
      next(error);
    }
  }
}

export const fileController = new FileController();
