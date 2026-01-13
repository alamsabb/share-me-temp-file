import { Request, Response, NextFunction } from "express";
import { isValidRoomCode } from "../utils/roomCodeGenerator";
import { validateFilename } from "../utils/pathSecurity";
import { HTTP_STATUS } from "../config/constants";

export function validateRoomCode(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { code } = req.params;

  if (!code || !isValidRoomCode(code)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Invalid room code format",
    });
    return;
  }

  next();
}

export function validateFilenameParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { filename } = req.params;

  if (!filename || !validateFilename(filename)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Invalid filename",
    });
    return;
  }

  next();
}
