import { Request, Response, NextFunction } from "express";
import { roomService } from "../services/RoomService";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants";

export class RoomController {
  async createRoom(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const room = roomService.createRoom();
      res.status(HTTP_STATUS.CREATED).json(room);
    } catch (error) {
      next(error);
    }
  }

  async getRoomDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.params;
      const room = roomService.getRoomDetails(code);

      if (!room) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.ROOM_NOT_FOUND,
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json(room);
    } catch (error) {
      next(error);
    }
  }

  async getFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.params;
      const room = roomService.getRoom(code);

      if (!room) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.ROOM_NOT_FOUND,
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        files: room.files,
      });
    } catch (error) {
      next(error);
    }
  }

  async getServerTime(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(HTTP_STATUS.OK).json({
        serverTime: Date.now(),
      });
    } catch (error) {
      next(error);
    }
  }

  // Public health check endpoint (no authentication required)
  async healthCheck(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(HTTP_STATUS.OK).json({
        status: "healthy",
        timestamp: Date.now(),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const roomController = new RoomController();
