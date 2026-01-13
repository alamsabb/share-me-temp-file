import { useParams, useNavigate } from "react-router-dom";
import { useRoomDetails } from "../hooks/useRoom";
import { useServerTime } from "../hooks/useServerTime";
import { RoomCode } from "../features/room/RoomCode";
import { RoomTimer } from "../features/room/RoomTimer";
import { FileUpload } from "../features/upload/FileUpload";
import { FileList } from "../features/download/FileList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Home, Loader2, AlertCircle } from "lucide-react";

export function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { data: room, isLoading, error } = useRoomDetails(code);
  const { timeOffset } = useServerTime();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Room Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error?.message || "This room does not exist or has expired."}
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <Home className="h-4 w-4" />
              Home
            </Button>
            <RoomTimer expiresAt={room.expiresAt} timeOffset={timeOffset} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Share Room</CardTitle>
            </CardHeader>
            <CardContent>
              <RoomCode code={room.code} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload roomCode={room.code} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files ({room.files.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <FileList files={room.files} roomCode={room.code} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
