import type { APIRoute } from "astro";
import {
  countLinksByProfileId,
  createLink,
  deleteLink,
  getLinkById,
  getLinksByProfileId,
  getProfileByUserId,
  getUserPlan,
  reorderLinks,
  updateLink,
  type LinkKind,
} from "../../../lib/db-queries";
import { canAddLink, canAddSocialLink } from "../../../lib/plans";
import { getLinkIconLabel, sanitizeLinkIcon, suggestLinkIcon } from "../../../lib/link-icons";

export const prerender = false;

async function getOwnedProfile(userId: string) {
  const profile = await getProfileByUserId(userId);
  if (!profile) throw new Error("Profile not found");
  return profile;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function parseKind(value: unknown): LinkKind {
  return value === "social" ? "social" : "link";
}

function normalizeUrl(raw: string) {
  let url = raw.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  new URL(url);
  return url;
}

export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getOwnedProfile(locals.user.id);
  const kindParam = url.searchParams.get("kind");
  const kind = kindParam === "social" || kindParam === "link" ? kindParam : undefined;
  const links = await getLinksByProfileId(profile.id, kind);
  return json({ links });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getOwnedProfile(locals.user.id);
  const plan = await getUserPlan(locals.user.id);
  const body = await request.json();
  const kind = parseKind(body.kind);

  const count = await countLinksByProfileId(profile.id, kind);
  if (kind === "social") {
    if (!canAddSocialLink(plan, count)) {
      return json({ error: "Social icon limit reached." }, 403);
    }
  } else if (!canAddLink(plan, count)) {
    return json({ error: "Link limit reached. Upgrade to Pro for unlimited links." }, 403);
  }

  let url = String(body.url ?? "").trim();
  const icon =
    body.icon !== undefined && String(body.icon).trim()
      ? sanitizeLinkIcon(body.icon)
      : suggestLinkIcon(url);
  const openInNewTab = body.openInNewTab !== undefined ? Boolean(body.openInNewTab) : true;
  const title =
    String(body.title ?? "").trim() || (kind === "social" ? getLinkIconLabel(icon) : "");

  if (!url) return json({ error: "URL is required" }, 400);
  if (kind === "link" && !title) return json({ error: "Title and URL are required" }, 400);

  try {
    url = normalizeUrl(url);
  } catch {
    return json({ error: "Invalid URL" }, 400);
  }

  const links = await getLinksByProfileId(profile.id, kind);
  const id = await createLink({
    profileId: profile.id,
    title,
    url,
    icon,
    sortOrder: links.length,
    openInNewTab,
    kind,
  });

  return json({ id }, 201);
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getOwnedProfile(locals.user.id);
  const body = await request.json();
  const linkId = String(body.id ?? "");

  const link = await getLinkById(linkId);
  if (!link || link.profileId !== profile.id) return json({ error: "Not found" }, 404);

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = String(body.title).trim();
  if (body.url !== undefined) {
    try {
      updates.url = normalizeUrl(String(body.url));
    } catch {
      return json({ error: "Invalid URL" }, 400);
    }
  }
  if (body.icon !== undefined) {
    const icon = sanitizeLinkIcon(body.icon);
    updates.icon = icon;
    if (link.kind === "social" && body.title === undefined) {
      updates.title = getLinkIconLabel(icon);
    }
  }
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
  if (body.openInNewTab !== undefined) updates.openInNewTab = Boolean(body.openInNewTab);

  await updateLink(linkId, updates);
  return json({ ok: true });
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getOwnedProfile(locals.user.id);
  const body = await request.json();
  const linkId = String(body.id ?? "");

  const link = await getLinkById(linkId);
  if (!link || link.profileId !== profile.id) return json({ error: "Not found" }, 404);

  await deleteLink(linkId);
  return json({ ok: true });
};

export const PATCH: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getOwnedProfile(locals.user.id);
  const body = await request.json();
  const kind = parseKind(body.kind);
  const orderedIds = Array.isArray(body.order) ? body.order.map(String) : [];

  const links = await getLinksByProfileId(profile.id, kind);
  const validIds = new Set(links.map((l) => l.id));
  if (orderedIds.length !== links.length || !orderedIds.every((id) => validIds.has(id))) {
    return json({ error: "Invalid order" }, 400);
  }

  await reorderLinks(profile.id, orderedIds, kind);
  return json({ ok: true });
};
