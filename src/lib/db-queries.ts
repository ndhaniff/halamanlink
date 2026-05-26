import {
  and,
  asc,
  count,
  db,
  desc,
  eq,
  gte,
} from "astro:db";
import {
  CustomDomains,
  LinkClicks,
  Links,
  Profiles,
  Subscriptions,
  Users,
} from "astro:db";
import { DEFAULT_THEME } from "./themes";
import type { PlanId } from "./plans";
import { slugify } from "./slug";

export type ProfileRecord = typeof Profiles.$inferSelect;
export type LinkRecord = typeof Links.$inferSelect;
export type SubscriptionRecord = typeof Subscriptions.$inferSelect;

export async function getUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email.toLowerCase().trim()));
  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  const rows = await db.select().from(Users).where(eq(Users.id, id));
  return rows[0] ?? null;
}

export async function createUserWithProfile(input: {
  email: string;
  passwordHash: string;
  name: string;
  slug?: string;
}) {
  const id = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const subscriptionId = crypto.randomUUID();
  const now = new Date();
  const email = input.email.toLowerCase().trim();
  let slug = input.slug ? slugify(input.slug) : slugify(input.name);
  if (!slug) slug = slugify(email.split("@")[0] ?? "user");

  let candidate = slug;
  let suffix = 1;
  while (await getProfileBySlug(candidate)) {
    candidate = `${slug}-${suffix++}`;
  }

  await db.insert(Users).values({
    id,
    email,
    passwordHash: input.passwordHash,
    name: input.name.trim(),
    createdAt: now,
  });

  await db.insert(Profiles).values({
    id: profileId,
    userId: id,
    slug: candidate,
    displayName: input.name.trim(),
    bio: "",
    avatarUrl: "",
    theme: DEFAULT_THEME,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(Subscriptions).values({
    id: subscriptionId,
    userId: id,
    stripeCustomerId: "",
    stripeSubscriptionId: "",
    plan: "free",
    status: "active",
    currentPeriodEnd: null,
    createdAt: now,
    updatedAt: now,
  });

  return { userId: id, profileId, slug: candidate };
}

export async function getProfileByUserId(userId: string) {
  const rows = await db
    .select()
    .from(Profiles)
    .where(eq(Profiles.userId, userId));
  return rows[0] ?? null;
}

export async function getProfileBySlug(slug: string) {
  const rows = await db
    .select()
    .from(Profiles)
    .where(eq(Profiles.slug, slug.toLowerCase()));
  return rows[0] ?? null;
}

export async function getProfileByVerifiedDomain(domain: string) {
  const normalized = domain.toLowerCase().trim();
  const rows = await db
    .select({ profile: Profiles })
    .from(CustomDomains)
    .innerJoin(Profiles, eq(CustomDomains.profileId, Profiles.id))
    .where(
      and(
        eq(CustomDomains.domain, normalized),
        eq(CustomDomains.verified, true),
      ),
    );
  return rows[0]?.profile ?? null;
}

export async function updateProfile(
  profileId: string,
  data: Partial<
    Pick<
      ProfileRecord,
      "slug" | "displayName" | "bio" | "avatarUrl" | "theme" | "isPublished"
    >
  >,
) {
  await db
    .update(Profiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(Profiles.id, profileId));
}

export async function getSubscriptionByUserId(userId: string) {
  const rows = await db
    .select()
    .from(Subscriptions)
    .where(eq(Subscriptions.userId, userId));
  return rows[0] ?? null;
}

export async function getUserPlan(userId: string): Promise<PlanId> {
  const sub = await getSubscriptionByUserId(userId);
  if (!sub) return "free";
  if (sub.plan === "pro" && sub.status === "active") return "pro";
  return "free";
}

export async function upsertSubscription(
  userId: string,
  data: Partial<
    Pick<
      SubscriptionRecord,
      | "stripeCustomerId"
      | "stripeSubscriptionId"
      | "plan"
      | "status"
      | "currentPeriodEnd"
    >
  >,
) {
  const existing = await getSubscriptionByUserId(userId);
  const now = new Date();
  if (existing) {
    await db
      .update(Subscriptions)
      .set({ ...data, updatedAt: now })
      .where(eq(Subscriptions.userId, userId));
  } else {
    await db.insert(Subscriptions).values({
      id: crypto.randomUUID(),
      userId,
      stripeCustomerId: data.stripeCustomerId ?? "",
      stripeSubscriptionId: data.stripeSubscriptionId ?? "",
      plan: data.plan ?? "free",
      status: data.status ?? "active",
      currentPeriodEnd: data.currentPeriodEnd ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function getLinksByProfileId(profileId: string) {
  return db
    .select()
    .from(Links)
    .where(eq(Links.profileId, profileId))
    .orderBy(asc(Links.sortOrder), asc(Links.createdAt));
}

export async function getActiveLinksByProfileId(profileId: string) {
  return db
    .select()
    .from(Links)
    .where(and(eq(Links.profileId, profileId), eq(Links.isActive, true)))
    .orderBy(asc(Links.sortOrder), asc(Links.createdAt));
}

export async function getLinkById(linkId: string) {
  const rows = await db.select().from(Links).where(eq(Links.id, linkId));
  return rows[0] ?? null;
}

export async function createLink(input: {
  profileId: string;
  title: string;
  url: string;
  icon?: string;
  sortOrder: number;
}) {
  const id = crypto.randomUUID();
  const now = new Date();
  await db.insert(Links).values({
    id,
    profileId: input.profileId,
    title: input.title.trim(),
    url: input.url.trim(),
    icon: input.icon?.trim() ?? "",
    sortOrder: input.sortOrder,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateLink(
  linkId: string,
  data: Partial<Pick<LinkRecord, "title" | "url" | "icon" | "isActive">>,
) {
  await db
    .update(Links)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(Links.id, linkId));
}

export async function deleteLink(linkId: string) {
  await db.delete(LinkClicks).where(eq(LinkClicks.linkId, linkId));
  await db.delete(Links).where(eq(Links.id, linkId));
}

export async function reorderLinks(
  profileId: string,
  orderedIds: string[],
) {
  const now = new Date();
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(Links)
      .set({ sortOrder: i, updatedAt: now })
      .where(and(eq(Links.id, orderedIds[i]!), eq(Links.profileId, profileId)));
  }
}

export async function countLinksByProfileId(profileId: string) {
  const rows = await db
    .select({ value: count() })
    .from(Links)
    .where(eq(Links.profileId, profileId));
  return rows[0]?.value ?? 0;
}

export async function recordLinkClick(input: {
  linkId: string;
  referrer: string;
  userAgent: string;
  ipHash: string;
}) {
  await db.insert(LinkClicks).values({
    id: crypto.randomUUID(),
    linkId: input.linkId,
    clickedAt: new Date(),
    referrer: input.referrer,
    userAgent: input.userAgent,
    ipHash: input.ipHash,
  });
}

export async function getAnalyticsSummary(
  profileId: string,
  days: number,
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const profileLinks = await getLinksByProfileId(profileId);
  const linkIds = profileLinks.map((l) => l.id);
  if (linkIds.length === 0) {
    return { totalClicks: 0, perLink: [], daily: [] };
  }

  const clicks = await db
    .select({
      linkId: LinkClicks.linkId,
      clickedAt: LinkClicks.clickedAt,
    })
    .from(LinkClicks)
    .innerJoin(Links, eq(LinkClicks.linkId, Links.id))
    .where(
      and(eq(Links.profileId, profileId), gte(LinkClicks.clickedAt, since)),
    );

  const perLinkMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();

  for (const click of clicks) {
    perLinkMap.set(click.linkId, (perLinkMap.get(click.linkId) ?? 0) + 1);
    const day = click.clickedAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }

  const perLink = profileLinks.map((link) => ({
    id: link.id,
    title: link.title,
    clicks: perLinkMap.get(link.id) ?? 0,
  }));

  const daily = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, clicksCount]) => ({ date, clicks: clicksCount }));

  return {
    totalClicks: clicks.length,
    perLink,
    daily,
  };
}

export async function getCustomDomainByProfileId(profileId: string) {
  const rows = await db
    .select()
    .from(CustomDomains)
    .where(eq(CustomDomains.profileId, profileId))
    .orderBy(desc(CustomDomains.createdAt));
  return rows[0] ?? null;
}

export async function upsertCustomDomain(input: {
  profileId: string;
  domain: string;
  verificationToken: string;
}) {
  const normalized = input.domain.toLowerCase().trim();
  const existing = await getCustomDomainByProfileId(input.profileId);
  const now = new Date();

  if (existing) {
    await db
      .update(CustomDomains)
      .set({
        domain: normalized,
        verified: false,
        verificationToken: input.verificationToken,
        updatedAt: now,
      })
      .where(eq(CustomDomains.id, existing.id));
    return existing.id;
  }

  const id = crypto.randomUUID();
  await db.insert(CustomDomains).values({
    id,
    profileId: input.profileId,
    domain: normalized,
    verified: false,
    verificationToken: input.verificationToken,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function getSubscriptionByStripeCustomerId(customerId: string) {
  const rows = await db
    .select()
    .from(Subscriptions)
    .where(eq(Subscriptions.stripeCustomerId, customerId));
  return rows[0] ?? null;
}

export async function isSlugAvailable(slug: string, excludeProfileId?: string) {
  const profile = await getProfileBySlug(slug);
  if (!profile) return true;
  if (excludeProfileId && profile.id === excludeProfileId) return true;
  return false;
}

export async function hashIpAddress(ip: string): Promise<string> {
  const data = new TextEncoder().encode(
    ip + (import.meta.env.SESSION_SECRET ?? "salt"),
  );
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .slice(0, 16)
    .join("");
}

export async function getUserByStripeCustomerId(customerId: string) {
  const sub = await getSubscriptionByStripeCustomerId(customerId);
  if (!sub) return null;
  return getUserById(sub.userId);
}
