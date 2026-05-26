import type { APIRoute } from "astro";
import {
  countLinksByProfileId,
  createLink,
  deleteLink,
  getLinkById,
  getLinksByProfileId,
  getProfileByUserId,
  reorderLinks,
  updateLink,
} from "../../../lib/db-queries";
import { canAddLink } from "../../../lib/plans";
import { sanitizeLinkIcon, suggestLinkIcon } from "../../../lib/link-icons";
import { getUserPlan } from "../../../lib/db-queries";

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

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getOwnedProfile(locals.user.id);
  const links = await getLinksByProfileId(profile.id);
  return json({ links });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getOwnedProfile(locals.user.id);
  const plan = await getUserPlan(locals.user.id);
  const count = await countLinksByProfileId(profile.id);

  if (!canAddLink(plan, count)) {
    return json({ error: "Link limit reached. Upgrade to Pro for unlimited links." }, 403);
  }

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  let url = String(body.url ?? "").trim();
  const icon =
    body.icon !== undefined && String(body.icon).trim()
      ? sanitizeLinkIcon(body.icon)
      : suggestLinkIcon(url);

  if (!title || !url) return json({ error: "Title and URL are required" }, 400);
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    new URL(url);
  } catch {
    return json({ error: "Invalid URL" }, 400);
  }

  const links = await getLinksByProfileId(profile.id);
  const id = await createLink({
    profileId: profile.id,
    title,
    url,
    icon,
    sortOrder: links.length,
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
    let url = String(body.url).trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = `https://${url}`;
    try {
      new URL(url);
      updates.url = url;
    } catch {
      return json({ error: "Invalid URL" }, 400);
    }
  }
  if (body.icon !== undefined) updates.icon = sanitizeLinkIcon(body.icon);
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);

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
  const orderedIds = Array.isArray(body.order) ? body.order.map(String) : [];

  const links = await getLinksByProfileId(profile.id);
  const validIds = new Set(links.map((l) => l.id));
  if (orderedIds.length !== links.length || !orderedIds.every((id) => validIds.has(id))) {
    return json({ error: "Invalid order" }, 400);
  }

  await reorderLinks(profile.id, orderedIds);
  return json({ ok: true });
};
