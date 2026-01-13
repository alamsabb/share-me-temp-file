import { roomService } from "../services/RoomService";
import { fileService } from "../services/FileService";
import { CONFIG } from "../config/constants";
import { Logger } from "../utils/logger";

class CleanupJob {
  private intervalId: NodeJS.Timeout | null = null;

  start(): void {
    Logger.info("Cleanup job started", {
      intervalMs: CONFIG.CLEANUP_INTERVAL_MS,
    });

    this.intervalId = setInterval(async () => {
      await this.cleanupExpiredRooms();
    }, CONFIG.CLEANUP_INTERVAL_MS);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      Logger.info("Cleanup job stopped");
    }
  }

  async cleanupExpiredRooms(): Promise<void> {
    const expiredRooms = roomService.getExpiredRooms();

    if (expiredRooms.length === 0) {
      return;
    }

    Logger.info("Cleaning up expired rooms", { count: expiredRooms.length });

    for (const room of expiredRooms) {
      try {
        await fileService.deleteRoomFiles(room);
        roomService.deleteRoom(room.code);
        Logger.info("Expired room cleaned", { code: room.code });
      } catch (error) {
        Logger.error("Failed to cleanup room", {
          code: room.code,
          error: error instanceof Error ? error.message : "Unknown",
        });
      }
    }
  }

  async runStartupCleanup(): Promise<void> {
    Logger.info("Running startup cleanup");
    await fileService.cleanOrphanedDirectories();
    await this.cleanupExpiredRooms();
  }
}

export const cleanupJob = new CleanupJob();
