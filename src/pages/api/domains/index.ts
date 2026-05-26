import type { APIRoute } from "astro";
import {
  getCustomDomainByProfileId,
  getProfileByUserId,
  upsertCustomDomain,
} from "../../../lib/db-queries";
import { canAddCustomDomain } from "../../../lib/plans";
import { getUserPlan } from "../../../lib/db-queries";
import { getAppDomain } from "../../../lib/app-env";
import { randomBytes } from "node:crypto";

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

  const domain = await getCustomDomainByProfileId(profile.id);
  const appDomain = getAppDomain();
  return json({
    domain: domain ?? null,
    dnsInstructions: domain
      ? {
          type: "CNAME",
          name: domain.domain,
          value: `app.${appDomain}`,
          verificationToken: domain.verificationToken,
          note: "DNS verification is not yet automated. Domain will remain pending until verified.",
        }
      : null,
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  const profile = await getProfileByUserId(locals.user.id);
  if (!profile) return json({ error: "Not found" }, 404);

  const plan = await getUserPlan(locals.user.id);
  const existing = await getCustomDomainByProfileId(profile.id);
  const count = existing ? 1 : 0;

  if (!canAddCustomDomain(plan, count) && !existing) {
    return json({ error: "Custom domains require a Pro plan." }, 403);
  }

  const body = await request.json();
  const domain = String(body.domain ?? "")
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

  if (!domain || !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
    return json({ error: "Invalid domain" }, 400);
  }

  const verificationToken = randomBytes(16).toString("hex");
  await upsertCustomDomain({ profileId: profile.id, domain, verificationToken });

  const appDomain = getAppDomain();
  return json({
    ok: true,
    domain,
    verified: false,
    dnsInstructions: {
      type: "CNAME",
      name: domain,
      value: `app.${appDomain}`,
      txtRecord: `_halamanlink.${domain}`,
      txtValue: verificationToken,
      note: "Add the CNAME record. TXT verification will be supported in a future update.",
    },
  });
};
