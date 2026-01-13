import crypto from "crypto";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 8;

export function generateRoomCode(): string {
  let code = "";
  const bytes = crypto.randomBytes(CODE_LENGTH);

  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARS[bytes[i] % CHARS.length];
  }

  return code;
}

export function isValidRoomCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}
