import { defineMiddleware } from "astro:middleware";
import { validateSession } from "./lib/auth";
import { getProfileByVerifiedDomain } from "./lib/db-queries";
import { RESERVED_SLUGS } from "./lib/constants";

function getAppDomain(): string {
  return import.meta.env.APP_DOMAIN || "localhost";
}

function resolveSubdomain(host: string, appDomain: string): string | null {
  if (host === appDomain || host === `app.${appDomain}`) return null;
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) return null;

  if (host.endsWith(`.${appDomain}`)) {
    const sub = host.slice(0, -(appDomain.length + 1));
    if (!sub || sub === "app" || sub === "www") return null;
    if (RESERVED_SLUGS.includes(sub)) return null;
    return sub;
  }

  return null;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url;
  const host = (context.request.headers.get("host") ?? "").split(":")[0] ?? "";
  const appDomain = getAppDomain();

  let profileSlug = resolveSubdomain(host, appDomain);

  if (!profileSlug && host && host !== appDomain && !host.startsWith("localhost")) {
    const profile = await getProfileByVerifiedDomain(host);
    if (profile) profileSlug = profile.slug;
  }

  if (
    profileSlug &&
    (url.pathname === "/" || url.pathname === "") &&
    !url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/r/")
  ) {
    return context.rewrite(new URL(`/p/${profileSlug}`, context.url));
  }

  const sessionId = context.cookies.get("halamanlink_session")?.value;
  if (sessionId) {
    const user = await validateSession(sessionId);
    if (user) context.locals.user = user;
  }

  if (url.pathname.startsWith("/dashboard") && !context.locals.user) {
    return context.redirect("/login");
  }

  if (
    context.locals.user &&
    (url.pathname === "/login" || url.pathname === "/signup")
  ) {
    return context.redirect("/dashboard");
  }

  return next();
});
