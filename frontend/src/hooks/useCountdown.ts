import { useState, useEffect } from "react";

export function useCountdown(
  expiresAt: number | undefined,
  timeOffset: number = 0
): string {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!expiresAt) return;

    const updateTime = () => {
      // Use synchronized time instead of local time
      const now = Date.now() - timeOffset;
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, timeOffset]);

  return timeLeft;
}
