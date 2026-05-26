import { column, defineDb, defineTable } from "astro:db";

const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text({ unique: true }),
    passwordHash: column.text(),
    name: column.text(),
    createdAt: column.date(),
  },
});

const Sessions = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => Users.columns.id }),
    expiresAt: column.date(),
    createdAt: column.date(),
  },
});

const Profiles = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ unique: true, references: () => Users.columns.id }),
    slug: column.text({ unique: true }),
    displayName: column.text(),
    bio: column.text({ default: "" }),
    avatarUrl: column.text({ default: "" }),
    theme: column.json(),
    isPublished: column.boolean({ default: true }),
    locationLat: column.number({ optional: true }),
    locationLng: column.number({ optional: true }),
    locationLabel: column.text({ default: "" }),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const Links = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    profileId: column.text({ references: () => Profiles.columns.id }),
    title: column.text(),
    url: column.text(),
    icon: column.text({ default: "" }),
    sortOrder: column.number({ default: 0 }),
    isActive: column.boolean({ default: true }),
    openInNewTab: column.boolean({ default: true }),
    kind: column.text({ default: "link" }),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const LinkClicks = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    linkId: column.text({ references: () => Links.columns.id }),
    clickedAt: column.date(),
    referrer: column.text({ default: "" }),
    userAgent: column.text({ default: "" }),
    ipHash: column.text({ default: "" }),
  },
});

const Subscriptions = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ unique: true, references: () => Users.columns.id }),
    stripeCustomerId: column.text({ default: "" }),
    stripeSubscriptionId: column.text({ default: "" }),
    plan: column.text({ default: "free" }),
    status: column.text({ default: "active" }),
    currentPeriodEnd: column.date({ optional: true }),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const CustomDomains = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    profileId: column.text({ references: () => Profiles.columns.id }),
    domain: column.text({ unique: true }),
    verified: column.boolean({ default: false }),
    verificationToken: column.text(),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

export default defineDb({
  tables: {
    Users,
    Sessions,
    Profiles,
    Links,
    LinkClicks,
    Subscriptions,
    CustomDomains,
  },
});
