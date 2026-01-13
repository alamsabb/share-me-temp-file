import fs from "fs/promises";
import path from "path";
import { FileMetadata, Room } from "../models/Room";
import { roomService } from "./RoomService";
import { CONFIG } from "../config/constants";
import { Logger } from "../utils/logger";
import { sanitizeFilename } from "../utils/pathSecurity";

class FileService {
  async addFileToRoom(
    code: string,
    file: Express.Multer.File
  ): Promise<FileMetadata> {
    const room = roomService.getRoom(code);
    if (!room) {
      throw new Error("Room not found");
    }

    const fileMetadata: FileMetadata = {
      filename: file.filename,
      originalName: sanitizeFilename(file.originalname),
      size: file.size,
      uploadedAt: Date.now(),
    };

    room.files.push(fileMetadata);
    Logger.info("File added to room", {
      code,
      filename: file.filename,
      size: file.size,
    });

    return fileMetadata;
  }

  async deleteRoomFiles(room: Room): Promise<void> {
    const roomDir = path.join(CONFIG.UPLOAD_DIR, room.code);

    try {
      await fs.rm(roomDir, { recursive: true, force: true });
      Logger.info("Room files deleted", { code: room.code });
    } catch (error) {
      Logger.error("Failed to delete room files", {
        code: room.code,
        error: error instanceof Error ? error.message : "Unknown",
      });
    }
  }

  getRoomDirectory(code: string): string {
    return path.join(CONFIG.UPLOAD_DIR, code);
  }

  getFilePath(code: string, filename: string): string {
    return path.join(this.getRoomDirectory(code), filename);
  }

  async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.mkdir(CONFIG.UPLOAD_DIR, { recursive: true });
      Logger.info("Upload directory ensured", { dir: CONFIG.UPLOAD_DIR });
    } catch (error) {
      Logger.error("Failed to create upload directory", {
        error: error instanceof Error ? error.message : "Unknown",
      });
      throw error;
    }
  }

  async cleanOrphanedDirectories(): Promise<void> {
    try {
      const entries = await fs.readdir(CONFIG.UPLOAD_DIR, {
        withFileTypes: true,
      });
      const rooms = roomService.getAllRooms();
      const validCodes = new Set(rooms.map((r) => r.code));

      for (const entry of entries) {
        if (entry.isDirectory() && !validCodes.has(entry.name)) {
          const orphanPath = path.join(CONFIG.UPLOAD_DIR, entry.name);
          await fs.rm(orphanPath, { recursive: true, force: true });
          Logger.info("Orphaned directory cleaned", { dir: entry.name });
        }
      }
    } catch (error) {
      Logger.error("Failed to clean orphaned directories", {
        error: error instanceof Error ? error.message : "Unknown",
      });
    }
  }
}

export const fileService = new FileService();
