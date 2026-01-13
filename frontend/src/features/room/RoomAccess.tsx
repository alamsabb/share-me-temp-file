import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateRoom } from "../../hooks/useRoom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2 } from "lucide-react";

export function CreateRoom() {
  const navigate = useNavigate();
  const { mutate: createRoom, isPending } = useCreateRoom();

  const handleCreateRoom = () => {
    createRoom(undefined, {
      onSuccess: (data) => {
        navigate(`/room/${data.code}`);
      },
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Room</CardTitle>
        <CardDescription>
          Create a temporary file sharing room that expires in 30 minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleCreateRoom}
          disabled={isPending}
          className="w-full"
          size="lg"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Room
        </Button>
      </CardContent>
    </Card>
  );
}

export function JoinRoom() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (code.trim()) {
      navigate(`/room/${code.toUpperCase()}`);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Join Existing Room</CardTitle>
        <CardDescription>
          Enter a room code to access shared files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter room code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={8}
          className="text-center text-lg tracking-widest"
          onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
        />
        <Button
          onClick={handleJoinRoom}
          disabled={!code.trim()}
          className="w-full"
          size="lg"
        >
          Join Room
        </Button>
      </CardContent>
    </Card>
  );
}
