export interface Room {
  code: string;
  expiresAt: number;
}

export interface FileMetadata {
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: number;
}

export interface RoomDetails {
  code: string;
  expiresAt: number;
  files: FileMetadata[];
  serverTime: number;
  remainingMs: number;
}

export interface UploadFileResponse {
  file: FileMetadata;
}
