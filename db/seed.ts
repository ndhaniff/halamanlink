import { db } from "astro:db";
import {
  CustomDomains,
  LinkClicks,
  Links,
  Profiles,
  Subscriptions,
  Users,
} from "astro:db";
import { hashPassword } from "../src/lib/auth";
import { DEFAULT_THEME } from "../src/lib/themes";

export default async function seed() {
  const now = new Date();
  const demoUserId = "00000000-0000-4000-8000-000000000001";
  const demoProfileId = "00000000-0000-4000-8000-000000000002";
  const demoSubId = "00000000-0000-4000-8000-000000000003";
  const passwordHash = await hashPassword("demo1234");

  await db.insert(Users).values({
    id: demoUserId,
    email: "demo@halamanlink.dev",
    passwordHash,
    name: "Demo User",
    createdAt: now,
  });

  await db.insert(Profiles).values({
    id: demoProfileId,
    userId: demoUserId,
    slug: "demo",
    displayName: "Demo User",
    bio: "Welcome to my link page!",
    avatarUrl: "",
    theme: DEFAULT_THEME,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(Subscriptions).values({
    id: demoSubId,
    userId: demoUserId,
    stripeCustomerId: "",
    stripeSubscriptionId: "",
    plan: "free",
    status: "active",
    currentPeriodEnd: null,
    createdAt: now,
    updatedAt: now,
  });

  const linkNow = new Date();
  await db.insert(Links).values([
    {
      id: "00000000-0000-4000-8000-000000000010",
      profileId: demoProfileId,
      title: "My Website",
      url: "https://example.com",
      icon: "🌐",
      sortOrder: 0,
      isActive: true,
      createdAt: linkNow,
      updatedAt: linkNow,
    },
    {
      id: "00000000-0000-4000-8000-000000000011",
      profileId: demoProfileId,
      title: "GitHub",
      url: "https://github.com",
      icon: "💻",
      sortOrder: 1,
      isActive: true,
      createdAt: linkNow,
      updatedAt: linkNow,
    },
  ]);
}
