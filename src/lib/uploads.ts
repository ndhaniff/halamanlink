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

export function avatarSourcePublicPath(profileId: string, ext: string): string {
  return `/uploads/avatars/${profileId}-source.${ext}`;
}

export function avatarDiskPath(profileId: string, ext: string): string {
  return path.join(getAvatarDir(), `${profileId}.${ext}`);
}

export function avatarSourceDiskPath(profileId: string, ext: string): string {
  return path.join(getAvatarDir(), `${profileId}-source.${ext}`);
}

export async function ensureAvatarDir(): Promise<void> {
  await mkdir(getAvatarDir(), { recursive: true });
}

export function validateAvatarFile(file: File): { ext: string } | { error: string } {
  const extFromName = path.extname(file.name).replace(/^\./, "").toLowerCase();
  const extFromType = file.type ? ALLOWED_TYPES.get(file.type) : undefined;
  const ext =
    extFromType ??
    (["jpg", "jpeg", "png", "webp", "gif"].includes(extFromName)
      ? extFromName === "jpeg"
        ? "jpg"
        : extFromName
      : undefined);

  if (!ext) {
    return { error: "Please upload a JPG, PNG, WebP, or GIF image." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { error: "Image must be 2 MB or smaller." };
  }
  return { ext };
}

async function removeAvatarDisplayFiles(profileId: string): Promise<void> {
  await ensureAvatarDir();
  const files = await readdir(getAvatarDir());
  const displayPattern = new RegExp(`^${profileId}\\.(jpg|jpeg|png|webp|gif)$`, "i");

  await Promise.all(
    files
      .filter((name) => displayPattern.test(name))
      .map((name) => unlink(path.join(getAvatarDir(), name)).catch(() => undefined)),
  );
}

async function removeAvatarSourceFiles(profileId: string): Promise<void> {
  await ensureAvatarDir();
  const files = await readdir(getAvatarDir());
  const sourcePattern = new RegExp(`^${profileId}-source\\.(jpg|jpeg|png|webp|gif)$`, "i");

  await Promise.all(
    files
      .filter((name) => sourcePattern.test(name))
      .map((name) => unlink(path.join(getAvatarDir(), name)).catch(() => undefined)),
  );
}

export async function saveAvatarSource(
  profileId: string,
  file: File,
): Promise<{ ok: true } | { error: string }> {
  const validation = validateAvatarFile(file);
  if ("error" in validation) return validation;

  await ensureAvatarDir();
  await removeAvatarSourceFiles(profileId);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(avatarSourceDiskPath(profileId, validation.ext), buffer);
  return { ok: true };
}

export async function saveAvatar(
  profileId: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const validation = validateAvatarFile(file);
  if ("error" in validation) return validation;

  await ensureAvatarDir();
  await removeAvatarDisplayFiles(profileId);

  const buffer = Buffer.from(await file.arrayBuffer());
  const diskPath = avatarDiskPath(profileId, validation.ext);
  await writeFile(diskPath, buffer);

  return { url: `${avatarPublicPath(profileId, validation.ext)}?v=${Date.now()}` };
}

export async function getAvatarSourceUrl(profileId: string): Promise<string | null> {
  await ensureAvatarDir();
  const files = await readdir(getAvatarDir());
  const match = files.find((name) =>
    new RegExp(`^${profileId}-source\\.(jpg|jpeg|png|webp|gif)$`, "i").test(name),
  );
  if (!match) return null;

  const ext = match.split(".").pop()?.toLowerCase() ?? "jpg";
  const normalizedExt = ext === "jpeg" ? "jpg" : ext;
  return `${avatarSourcePublicPath(profileId, normalizedExt)}?v=${Date.now()}`;
}

export async function removeAvatarFiles(profileId: string): Promise<void> {
  await removeAvatarDisplayFiles(profileId);
  await removeAvatarSourceFiles(profileId);
}

export function isSafeAvatarFilename(filename: string): boolean {
  return /^[0-9a-f-]{36}(-source)?\.(jpg|jpeg|png|webp|gif)$/i.test(filename);
}

export async function readAvatarFile(
  filename: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
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
