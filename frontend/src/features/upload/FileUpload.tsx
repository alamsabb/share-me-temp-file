import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUploadFile } from "../../hooks/useRoom";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Upload, Loader2 } from "lucide-react";

interface Props {
  roomCode: string;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function FileUpload({ roomCode }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const { mutate: uploadFile, isPending } = useUploadFile(
    roomCode,
    setProgress
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 100MB");
      return;
    }

    setProgress(0);
    uploadFile(file, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["room", roomCode] });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setProgress(0);
      },
      onError: (error) => {
        alert(error.message || "Upload failed");
        setProgress(0);
      },
    });
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isPending}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            Upload File
          </>
        )}
      </Button>
      {isPending && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            {progress}%
          </p>
        </div>
      )}
    </div>
  );
}
