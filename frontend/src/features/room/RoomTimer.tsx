import { useCountdown } from "../../hooks/useCountdown";
import { Clock } from "lucide-react";

interface Props {
  expiresAt: number;
  timeOffset?: number;
}

export function RoomTimer({ expiresAt, timeOffset = 0 }: Props) {
  const timeLeft = useCountdown(expiresAt, timeOffset);

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Clock className="h-4 w-4" />
      <span>Expires in: {timeLeft}</span>
    </div>
  );
}
