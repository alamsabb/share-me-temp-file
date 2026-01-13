import { CreateRoom, JoinRoom } from "../features/room/RoomAccess";
import { Share2 } from "lucide-react";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Share2 className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">TempShare</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share files temporarily with anyone. Rooms expire in 30 minutes,
            ensuring your data never persists.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <CreateRoom />
          <JoinRoom />
        </div>
      </div>
    </div>
  );
}
