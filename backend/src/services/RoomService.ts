import { Room, CreateRoomResponse, RoomDetailsResponse } from "../models/Room";
import { generateRoomCode } from "../utils/roomCodeGenerator";
import { CONFIG } from "../config/constants";
import { Logger } from "../utils/logger";

class RoomService {
  private rooms: Map<string, Room> = new Map();

  createRoom(): CreateRoomResponse {
    let code = generateRoomCode();

    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }

    const now = Date.now();
    const expiresAt = now + CONFIG.ROOM_EXPIRATION_MS;

    const room: Room = {
      code,
      createdAt: now,
      expiresAt,
      files: [],
    };

    this.rooms.set(code, room);
    Logger.info("Room created", { code, expiresAt });

    return { code, expiresAt };
  }

  getRoom(code: string): Room | null {
    return this.rooms.get(code) || null;
  }

  getRoomDetails(code: string): RoomDetailsResponse | null {
    const room = this.getRoom(code);
    if (!room) {
      return null;
    }

    const now = Date.now();
    const remainingMs = Math.max(0, room.expiresAt - now);

    return {
      code: room.code,
      expiresAt: room.expiresAt,
      files: room.files,
      serverTime: now,
      remainingMs,
    };
  }

  isRoomExpired(room: Room): boolean {
    return Date.now() > room.expiresAt;
  }

  deleteRoom(code: string): boolean {
    const deleted = this.rooms.delete(code);
    if (deleted) {
      Logger.info("Room deleted", { code });
    }
    return deleted;
  }

  getExpiredRooms(): Room[] {
    const now = Date.now();
    const expired: Room[] = [];

    this.rooms.forEach((room) => {
      if (now > room.expiresAt) {
        expired.push(room);
      }
    });

    return expired;
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

export const roomService = new RoomService();
