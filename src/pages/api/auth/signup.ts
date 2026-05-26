import type { APIRoute } from "astro";
import {
  clearSessionCookie,
  createSession,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from "../../../lib/auth";
import { getUserByEmail, createUserWithProfile } from "../../../lib/db-queries";
import { isValidSlug, slugify } from "../../../lib/slug";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const customSlug = body.slug ? slugify(String(body.slug)) : undefined;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Name, email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (customSlug && !isValidSlug(customSlug)) {
      return new Response(JSON.stringify({ error: "Invalid or reserved slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already registered" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const passwordHash = await hashPassword(password);
    const { userId, slug } = await createUserWithProfile({
      email,
      passwordHash,
      name,
      slug: customSlug,
    });

    const sessionId = await createSession(userId);
    setSessionCookie(cookies, sessionId);

    return new Response(JSON.stringify({ ok: true, slug }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: "Signup failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
