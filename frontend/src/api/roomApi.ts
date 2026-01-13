import { apiClient } from "./client";
import type { Room, RoomDetails, UploadFileResponse } from "../types";

export const roomApi = {
  createRoom: async (): Promise<Room> => {
    const { data } = await apiClient.post<Room>("/rooms");
    return data;
  },

  getRoomDetails: async (code: string): Promise<RoomDetails> => {
    const { data } = await apiClient.get<RoomDetails>(`/rooms/${code}`);
    return data;
  },

  getFiles: async (code: string): Promise<RoomDetails> => {
    const { data } = await apiClient.get<RoomDetails>(`/rooms/${code}/files`);
    return data;
  },

  uploadFile: async (
    code: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<UploadFileResponse>(
      `/rooms/${code}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );
    return data;
  },

  downloadFile: (code: string, filename: string): string => {
    return `${apiClient.defaults.baseURL}/rooms/${code}/files/${filename}`;
  },

  getServerTime: async (): Promise<number> => {
    const { data } = await apiClient.get<{ serverTime: number }>("/time");
    return data.serverTime;
  },
};
