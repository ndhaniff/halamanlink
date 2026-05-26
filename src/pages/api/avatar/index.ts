import type { APIRoute } from "astro";
import {
  getProfileByUserId,
  updateProfile,
} from "../../../lib/db-queries";
import { removeAvatarFiles, saveAvatar } from "../../../lib/uploads";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  try {
    const profile = await getProfileByUserId(locals.user.id);
    if (!profile) return json({ error: "Profile not found" }, 404);

    const form = await request.formData();
    const file = form.get("avatar");

    if (!(file instanceof File) || file.size === 0) {
      return json({ error: "No image file provided" }, 400);
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
