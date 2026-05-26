import { db, eq, gt } from "astro:db";
import { Sessions, Users } from "astro:db";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { SESSION_DURATION_MS } from "./constants";

const scryptAsync = promisify(scrypt);

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");
  if (derived.length !== keyBuffer.length) return false;
  return timingSafeEqual(derived, keyBuffer);
}

export async function createSession(userId: string): Promise<string> {
  const id = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  await db.insert(Sessions).values({
    id,
    userId,
    expiresAt,
    createdAt: now,
  });

  return id;
}

export async function validateSession(
  sessionId: string,
): Promise<SessionUser | null> {
  const now = new Date();
  const rows = await db
    .select({
      sessionId: Sessions.id,
      userId: Users.id,
      email: Users.email,
      name: Users.name,
      expiresAt: Sessions.expiresAt,
    })
    .from(Sessions)
    .innerJoin(Users, eq(Sessions.userId, Users.id))
    .where(eq(Sessions.id, sessionId));

  const row = rows[0];
  if (!row || row.expiresAt < now) {
    if (row) await db.delete(Sessions).where(eq(Sessions.id, sessionId));
    return null;
  }

  return { id: row.userId, email: row.email, name: row.name };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(Sessions).where(eq(Sessions.id, sessionId));
}

export async function deleteExpiredSessions(): Promise<void> {
  await db.delete(Sessions).where(gt(Sessions.expiresAt, new Date()));
}

export function setSessionCookie(
  cookies: AstroCookies,
  sessionId: string,
): void {
  cookies.set("halamanlink_session", sessionId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete("halamanlink_session", { path: "/" });
}
