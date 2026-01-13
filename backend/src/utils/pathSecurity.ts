import path from "path";

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function isPathTraversal(userPath: string): boolean {
  const normalized = path.normalize(userPath);
  return normalized.includes("..") || path.isAbsolute(normalized);
}

export function validateFilename(filename: string): boolean {
  if (!filename || filename.length === 0 || filename.length > 255) {
    return false;
  }

  if (isPathTraversal(filename)) {
    return false;
  }

  const dangerousPatterns = /[<>:"|?*\x00-\x1f]/;
  return !dangerousPatterns.test(filename);
}
