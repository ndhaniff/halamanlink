import type { APIRoute } from "astro";
import { readAvatarFile } from "../../../lib/uploads";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const filename = params.filename;
  if (!filename) return new Response("Not found", { status: 404 });

  const file = await readAvatarFile(filename);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.buffer, {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
};
