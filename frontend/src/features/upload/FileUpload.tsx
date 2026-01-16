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
  const [totalProgress, setTotalProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: uploadFile } = useUploadFile(roomCode);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate size
    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large (Max 100MB)`);
        return;
      }
    }

    setIsUploading(true);
    setTotalProgress(0);

    // Track progress of each file to calculate total weighted average
    const fileProgressMap: Record<string, number> = {};
    const totalSize = fileArray.reduce((acc, file) => acc + file.size, 0);

    const updateAggregateProgress = () => {
      const totalUploaded = fileArray.reduce((acc, file) => {
        const p = fileProgressMap[file.name] || 0;
        return acc + (p / 100) * file.size;
      }, 0);
      setTotalProgress(Math.round((totalUploaded / totalSize) * 100));
    };

    try {
      await Promise.all(
        fileArray.map((file) =>
          uploadFile({
            file,
            onProgress: (p) => {
              fileProgressMap[file.name] = p;
              updateAggregateProgress();
            },
          })
        )
      );

      queryClient.invalidateQueries({ queryKey: ["room", roomCode] });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTotalProgress(0);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "One or more uploads failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
        size="lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            Upload Files
          </>
        )}
      </Button>
      {isUploading && (
        <div className="space-y-2">
          <Progress value={totalProgress} />
          <p className="text-sm text-center text-muted-foreground">
            {totalProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
