import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { roomApi } from "../api/roomApi";
import type { Room, RoomDetails, UploadFileResponse } from "../types";

export function useCreateRoom(): UseMutationResult<Room, Error> {
  return useMutation({
    mutationFn: () => roomApi.createRoom(),
  });
}

export function useRoomDetails(
  code: string | undefined
): UseQueryResult<RoomDetails, Error> {
  return useQuery({
    queryKey: ["room", code],
    queryFn: () => roomApi.getRoomDetails(code!),
    enabled: !!code,
    // ✅ 300 seconds freshness
    staleTime: 300_000,

    // ✅ light polling (optional)
    refetchInterval: 10_000, // 10 sec is reasonable
    refetchIntervalInBackground: true,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export type UploadVariables = {
  file: File;
  onProgress?: (progress: number) => void;
};

export function useUploadFile(
  code: string
): UseMutationResult<UploadFileResponse, Error, UploadVariables> {
  return useMutation({
    mutationFn: ({ file, onProgress }) =>
      roomApi.uploadFile(code, file, onProgress),
  });
}
