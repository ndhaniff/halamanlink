import type { APIRoute } from "astro";
import {
  clearSessionCookie,
  deleteSession,
} from "../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const sessionId = cookies.get("halamanlink_session")?.value;
  if (sessionId) {
    await deleteSession(sessionId);
  }
  clearSessionCookie(cookies);
  return redirect("/login");
};
