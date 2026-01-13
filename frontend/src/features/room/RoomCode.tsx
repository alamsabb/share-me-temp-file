import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";

interface Props {
  code: string;
}

export function RoomCode({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-muted rounded-lg px-4 py-3">
        <p className="text-xs text-muted-foreground mb-1">Room Code</p>
        <p className="text-2xl font-bold tracking-widest">{code}</p>
      </div>
      <Button
        onClick={handleCopy}
        variant="outline"
        size="icon"
        className="h-12 w-12"
      >
        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
      </Button>
    </div>
  );
}
