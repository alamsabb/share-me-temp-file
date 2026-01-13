export interface Room {
  code: string;
  createdAt: number;
  expiresAt: number;
  files: FileMetadata[];
}

export interface FileMetadata {
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: number;
}

export interface CreateRoomResponse {
  code: string;
  expiresAt: number;
}

export interface RoomDetailsResponse {
  code: string;
  expiresAt: number;
  files: FileMetadata[];
  serverTime: number;
  remainingMs: number;
}
