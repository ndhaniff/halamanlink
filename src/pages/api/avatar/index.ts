import type { APIRoute } from "astro";
import {
  getProfileByUserId,
  updateProfile,
} from "../../../lib/db-queries";
import {
  getAvatarSourceUrl,
  removeAvatarFiles,
  saveAvatar,
  saveAvatarSource,
} from "../../../lib/uploads";

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
  if (!profile) return json({ error: "Profile not found" }, 404);

  const sourceUrl = await getAvatarSourceUrl(profile.id);
  return json({
    avatarUrl: profile.avatarUrl,
    editUrl: sourceUrl ?? profile.avatarUrl,
    hasSource: Boolean(sourceUrl),
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  try {
    const profile = await getProfileByUserId(locals.user.id);
    if (!profile) return json({ error: "Profile not found" }, 404);

    const form = await request.formData();
    const file = form.get("avatar");
    const source = form.get("source");

    if (!(file instanceof File) || file.size === 0) {
      return json({ error: "No image file provided" }, 400);
    }

    if (source instanceof File && source.size > 0) {
      const savedSource = await saveAvatarSource(profile.id, source);
      if ("error" in savedSource) return json({ error: savedSource.error }, 400);
    }

    const saved = await saveAvatar(profile.id, file);
    if ("error" in saved) return json({ error: saved.error }, 400);

    await updateProfile(profile.id, { avatarUrl: saved.url });

    return json({ ok: true, avatarUrl: saved.url });
  } catch (error) {
    console.error("Avatar upload failed:", error);
    return json({ error: "Could not save image. Try again or use an image URL." }, 500);
  }
};

export const DELETE: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  try {
    const profile = await getProfileByUserId(locals.user.id);
    if (!profile) return json({ error: "Profile not found" }, 404);

    await removeAvatarFiles(profile.id);
    await updateProfile(profile.id, { avatarUrl: "" });

    return json({ ok: true, avatarUrl: "" });
  } catch (error) {
    console.error("Avatar remove failed:", error);
    return json({ error: "Could not remove image." }, 500);
  }
};
