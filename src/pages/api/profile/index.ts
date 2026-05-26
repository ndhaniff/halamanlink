import type { APIRoute } from "astro";
import {
  getProfileByUserId,
  updateProfile,
  isSlugAvailable,
} from "../../../lib/db-queries";
import { removeAvatarFiles } from "../../../lib/uploads";
import { isValidSlug, slugify } from "../../../lib/slug";
import { parseTheme } from "../../../lib/themes";
import { canUseTheme } from "../../../lib/plans";
import { getUserPlan } from "../../../lib/db-queries";
import { parseCoordinate, validateCoordinates } from "../../../lib/location";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getProfileByUserId(locals.user.id);
  if (!profile) return json({ error: "Not found" }, 404);
  return json({ profile });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getProfileByUserId(locals.user.id);
  if (!profile) return json({ error: "Not found" }, 404);

  const body = await request.json();
  const plan = await getUserPlan(locals.user.id);
  const updates: Record<string, unknown> = {};

  if (body.displayName !== undefined) {
    updates.displayName = String(body.displayName).trim();
  }
  if (body.bio !== undefined) {
    updates.bio = String(body.bio).trim();
  }
  if (body.avatarUrl !== undefined) {
    const url = String(body.avatarUrl).trim();
    if (!url && profile.avatarUrl.startsWith("/uploads/avatars/")) {
      await removeAvatarFiles(profile.id);
    }
    updates.avatarUrl = url;
  }
  if (body.isPublished !== undefined) {
    updates.isPublished = Boolean(body.isPublished);
  }
  if (body.slug !== undefined) {
    const slug = slugify(String(body.slug));
    if (!isValidSlug(slug)) return json({ error: "Invalid or reserved slug" }, 400);
    if (!(await isSlugAvailable(slug, profile.id))) {
      return json({ error: "Slug is already taken" }, 409);
    }
    updates.slug = slug;
  }
  if (body.theme !== undefined) {
    const theme = parseTheme(body.theme);
    if (!canUseTheme(plan, theme.id)) {
      return json({ error: "Theme not available on your plan" }, 403);
    }
    updates.theme = theme;
  }

  if (
    body.locationLat !== undefined ||
    body.locationLng !== undefined ||
    body.locationLabel !== undefined
  ) {
    const lat =
      body.locationLat !== undefined ? parseCoordinate(body.locationLat) : profile.locationLat ?? null;
    const lng =
      body.locationLng !== undefined ? parseCoordinate(body.locationLng) : profile.locationLng ?? null;

    if (lat === null && lng === null) {
      updates.locationLat = null;
      updates.locationLng = null;
    } else {
      if (lat === null || lng === null) {
        return json({ error: "Provide both latitude and longitude, or leave both empty." }, 400);
      }
      const check = validateCoordinates(lat, lng);
      if (!check.ok) return json({ error: check.error }, 400);
      updates.locationLat = lat;
      updates.locationLng = lng;
    }

    if (body.locationLabel !== undefined) {
      updates.locationLabel = String(body.locationLabel).trim();
    }
  }

  await updateProfile(profile.id, updates);
  const updated = await getProfileByUserId(locals.user.id);
  return json({ profile: updated });
};
