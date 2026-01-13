import { formatBytes } from "../../utils";
import { roomApi } from "../../api/roomApi";
import { Download, FileIcon } from "lucide-react";
import type { FileMetadata } from "../../types";
import { Button } from "../../components/ui/button";

interface Props {
  files: FileMetadata[];
  roomCode: string;
}

export function FileList({ files, roomCode }: Props) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.filename}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileIcon className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{file.originalName}</p>
              <p className="text-sm text-muted-foreground">
                {formatBytes(file.size)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href={roomApi.downloadFile(roomCode, file.filename)}
              download={file.originalName}
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
}
