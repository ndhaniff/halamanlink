import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export function getUploadRoot(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
}

export function getAvatarDir(): string {
  return path.join(getUploadRoot(), "avatars");
}

export function avatarPublicPath(profileId: string, ext: string): string {
  return `/uploads/avatars/${profileId}.${ext}`;
}

export function avatarDiskPath(profileId: string, ext: string): string {
  return path.join(getAvatarDir(), `${profileId}.${ext}`);
}

export async function ensureAvatarDir(): Promise<void> {
  await mkdir(getAvatarDir(), { recursive: true });
}

export function validateAvatarFile(file: File): { ext: string } | { error: string } {
  const extFromName = path.extname(file.name).replace(/^\./, "").toLowerCase();
  const extFromType = file.type ? ALLOWED_TYPES.get(file.type) : undefined;
  const ext = extFromType ?? (["jpg", "jpeg", "png", "webp", "gif"].includes(extFromName) ? (extFromName === "jpeg" ? "jpg" : extFromName) : undefined);

  if (!ext) {
    return { error: "Please upload a JPG, PNG, WebP, or GIF image." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { error: "Image must be 2 MB or smaller." };
  }
  return { ext };
}

export async function saveAvatar(profileId: string, file: File): Promise<{ url: string } | { error: string }> {
  const validation = validateAvatarFile(file);
  if ("error" in validation) return validation;

  await ensureAvatarDir();
  await removeAvatarFiles(profileId);

  const buffer = Buffer.from(await file.arrayBuffer());
  const diskPath = avatarDiskPath(profileId, validation.ext);
  await writeFile(diskPath, buffer);

  return { url: `${avatarPublicPath(profileId, validation.ext)}?v=${Date.now()}` };
}

export async function removeAvatarFiles(profileId: string): Promise<void> {
  await ensureAvatarDir();
  const files = await readdir(getAvatarDir());
  const prefix = `${profileId}.`;

  await Promise.all(
    files
      .filter((name) => name.startsWith(prefix))
      .map((name) => unlink(path.join(getAvatarDir(), name)).catch(() => undefined)),
  );
}

export function isSafeAvatarFilename(filename: string): boolean {
  return /^[0-9a-f-]{36}\.(jpg|jpeg|png|webp|gif)$/i.test(filename);
}

export async function readAvatarFile(filename: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!isSafeAvatarFilename(filename)) return null;

  const ext = filename.split(".").pop()?.toLowerCase();
  const contentType =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : null;

  if (!contentType) return null;

  try {
    const buffer = await readFile(path.join(getAvatarDir(), filename));
    return { buffer, contentType };
  } catch {
    return null;
  }
}
