import type { APIRoute } from "astro";
import {
  getLinkById,
  hashIpAddress,
  recordLinkClick,
} from "../../lib/db-queries";

export const prerender = false;

export const GET: APIRoute = async ({ params, request, redirect }) => {
  const linkId = params.id;
  if (!linkId) return new Response("Not found", { status: 404 });

  const link = await getLinkById(linkId);
  if (!link || !link.isActive) return new Response("Not found", { status: 404 });

  const referrer = request.headers.get("referer") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const ipHash = await hashIpAddress(ip);

  await recordLinkClick({ linkId, referrer, userAgent, ipHash });

  return redirect(link.url, 302);
};
