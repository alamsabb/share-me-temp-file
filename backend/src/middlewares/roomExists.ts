import { Request, Response, NextFunction } from "express";
import { roomService } from "../services/RoomService";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants";
import fs from "fs/promises";
import { fileService } from "../services/FileService";

export async function ensureRoomExists(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { code } = req.params;
  const room = roomService.getRoom(code);

  if (!room) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      error: ERROR_MESSAGES.ROOM_NOT_FOUND,
    });
    return;
  }

  if (roomService.isRoomExpired(room)) {
    res.status(HTTP_STATUS.GONE).json({
      error: ERROR_MESSAGES.ROOM_EXPIRED,
    });
    return;
  }

  next();
}

export async function ensureRoomDirectory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { code } = req.params;
  const roomDir = fileService.getRoomDirectory(code);

  try {
    await fs.mkdir(roomDir, { recursive: true });
    next();
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: "Failed to create room directory",
    });
  }
}
