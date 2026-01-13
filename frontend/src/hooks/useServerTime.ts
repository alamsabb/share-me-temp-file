import { useState, useEffect } from "react";
import { roomApi } from "../api/roomApi";

interface ServerTimeSync {
  timeOffset: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to synchronize client time with server time
 * Calculates the offset between client and server clocks
 */
export function useServerTime(): ServerTimeSync {
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const clientTimeBefore = Date.now();
        const serverTime = await roomApi.getServerTime();
        const clientTimeAfter = Date.now();

        // Calculate round-trip time and adjust server time
        const roundTripTime = clientTimeAfter - clientTimeBefore;
        const estimatedServerTime = serverTime + roundTripTime / 2;

        // Calculate offset: positive means client is ahead, negative means behind
        const offset = clientTimeAfter - estimatedServerTime;

        setTimeOffset(offset);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to sync time"));
        setIsLoading(false);
        // Fallback to no offset if sync fails
        setTimeOffset(0);
      }
    };

    fetchServerTime();
  }, []);

  return { timeOffset, isLoading, error };
}

/**
 * Get synchronized server time
 */
export function getSyncedTime(timeOffset: number): number {
  return Date.now() - timeOffset;
}
