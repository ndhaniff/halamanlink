import {
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  Coffee,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Gift,
  Globe,
  Headphones,
  Heart,
  Link,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Music,
  Newspaper,
  PenTool,
  Phone,
  Play,
  Rss,
  Send,
  Share2,
  ShoppingBag,
  Smartphone,
  Store,
  Video,
  type IconNode,
} from "lucide";
import * as simpleIcons from "simple-icons";

export type LinkIconId = keyof typeof LINK_ICONS;

type LucideIconEntry = {
  label: string;
  kind: "lucide";
  node: IconNode;
};

type SimpleIconEntry = {
  label: string;
  kind: "simple";
  slug: string;
};

export const LINK_ICONS = {
  link: { label: "Link", kind: "lucide", node: Link },
  globe: { label: "Website", kind: "lucide", node: Globe },
  external: { label: "External", kind: "lucide", node: ExternalLink },
  share: { label: "Share", kind: "lucide", node: Share2 },
  mail: { label: "Email", kind: "lucide", node: Mail },
  phone: { label: "Phone", kind: "lucide", node: Phone },
  message: { label: "Message", kind: "lucide", node: MessageCircle },
  send: { label: "Send", kind: "lucide", node: Send },
  calendar: { label: "Calendar", kind: "lucide", node: Calendar },
  book: { label: "Book", kind: "lucide", node: BookOpen },
  news: { label: "Newsletter", kind: "lucide", node: Newspaper },
  file: { label: "Document", kind: "lucide", node: FileText },
  music: { label: "Music", kind: "lucide", node: Music },
  video: { label: "Video", kind: "lucide", node: Video },
  play: { label: "Play", kind: "lucide", node: Play },
  podcast: { label: "Podcast", kind: "lucide", node: Mic },
  camera: { label: "Photo", kind: "lucide", node: Camera },
  shop: { label: "Shop", kind: "lucide", node: ShoppingBag },
  store: { label: "Store", kind: "lucide", node: Store },
  card: { label: "Payment", kind: "lucide", node: CreditCard },
  gift: { label: "Gift", kind: "lucide", node: Gift },
  download: { label: "Download", kind: "lucide", node: Download },
  briefcase: { label: "Work", kind: "lucide", node: Briefcase },
  pen: { label: "Writing", kind: "lucide", node: PenTool },
  coffee: { label: "Coffee", kind: "lucide", node: Coffee },
  heart: { label: "Support", kind: "lucide", node: Heart },
  map: { label: "Location", kind: "lucide", node: MapPin },
  rss: { label: "RSS", kind: "lucide", node: Rss },
  headphones: { label: "Audio", kind: "lucide", node: Headphones },
  mobile: { label: "App", kind: "lucide", node: Smartphone },
  github: { label: "GitHub", kind: "simple", slug: "github" },
  gitlab: { label: "GitLab", kind: "simple", slug: "gitlab" },
  instagram: { label: "Instagram", kind: "simple", slug: "instagram" },
  youtube: { label: "YouTube", kind: "simple", slug: "youtube" },
  x: { label: "X", kind: "simple", slug: "x" },
  twitter: { label: "Twitter", kind: "simple", slug: "x" },
  linkedin: { label: "LinkedIn", kind: "simple", slug: "linkedin" },
  facebook: { label: "Facebook", kind: "simple", slug: "facebook" },
  tiktok: { label: "TikTok", kind: "simple", slug: "tiktok" },
  twitch: { label: "Twitch", kind: "simple", slug: "twitch" },
  spotify: { label: "Spotify", kind: "simple", slug: "spotify" },
  discord: { label: "Discord", kind: "simple", slug: "discord" },
  whatsapp: { label: "WhatsApp", kind: "simple", slug: "whatsapp" },
  telegram: { label: "Telegram", kind: "simple", slug: "telegram" },
  threads: { label: "Threads", kind: "simple", slug: "threads" },
  pinterest: { label: "Pinterest", kind: "simple", slug: "pinterest" },
  reddit: { label: "Reddit", kind: "simple", slug: "reddit" },
  snapchat: { label: "Snapchat", kind: "simple", slug: "snapchat" },
  behance: { label: "Behance", kind: "simple", slug: "behance" },
  dribbble: { label: "Dribbble", kind: "simple", slug: "dribbble" },
  medium: { label: "Medium", kind: "simple", slug: "medium" },
  substack: { label: "Substack", kind: "simple", slug: "substack" },
  patreon: { label: "Patreon", kind: "simple", slug: "patreon" },
  apple: { label: "Apple", kind: "simple", slug: "apple" },
  google: { label: "Google", kind: "simple", slug: "google" },
  shopify: { label: "Shopify", kind: "simple", slug: "shopify" },
  etsy: { label: "Etsy", kind: "simple", slug: "etsy" },
  paypal: { label: "PayPal", kind: "simple", slug: "paypal" },
  stripe: { label: "Stripe", kind: "simple", slug: "stripe" },
  linktree: { label: "Linktree", kind: "simple", slug: "linktree" },
} satisfies Record<string, LucideIconEntry | SimpleIconEntry>;

export const DEFAULT_LINK_ICON: LinkIconId = "link";

const LEGACY_ICON_MAP: Record<string, LinkIconId> = {
  "↗": "link",
  "🌐": "globe",
  "💻": "github",
  "📧": "mail",
  "✉️": "mail",
  "📱": "mobile",
  "🎵": "music",
  "📷": "camera",
  "📺": "video",
  Book: "book",
  Mail: "mail",
  Cal: "calendar",
  Spotify: "spotify",
  Youtube: "youtube",
  Camera: "camera",
};

const URL_ICON_RULES: Array<[RegExp, LinkIconId]> = [
  [/github\.com/i, "github"],
  [/gitlab\.com/i, "gitlab"],
  [/instagram\.com/i, "instagram"],
  [/youtube\.com|youtu\.be/i, "youtube"],
  [/(twitter\.com|x\.com)\//i, "x"],
  [/linkedin\.com/i, "linkedin"],
  [/facebook\.com|fb\.com/i, "facebook"],
  [/tiktok\.com/i, "tiktok"],
  [/twitch\.tv/i, "twitch"],
  [/open\.spotify\.com|spotify\.com/i, "spotify"],
  [/discord\.(gg|com)/i, "discord"],
  [/wa\.me|whatsapp\.com/i, "whatsapp"],
  [/t\.me|telegram\.(me|org)/i, "telegram"],
  [/threads\.net/i, "threads"],
  [/pinterest\.com/i, "pinterest"],
  [/reddit\.com/i, "reddit"],
  [/snapchat\.com/i, "snapchat"],
  [/behance\.net/i, "behance"],
  [/dribbble\.com/i, "dribbble"],
  [/medium\.com/i, "medium"],
  [/substack\.com/i, "substack"],
  [/patreon\.com/i, "patreon"],
  [/shopify\.com/i, "shopify"],
  [/etsy\.com/i, "etsy"],
  [/paypal\.(com|me)/i, "paypal"],
  [/stripe\.com/i, "stripe"],
  [/linktr\.ee/i, "linktree"],
  [/mailto:/i, "mail"],
  [/tel:/i, "phone"],
  [/calendly\.com|calendar\.google/i, "calendar"],
];

const SVG_DEFAULTS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const;

type ChildNode = [string, Record<string, string | number>];
type SvgNode = [string, Record<string, string | number>, ChildNode[]?];

function escapeAttr(value: string | number): string {
  return String(value).replace(/"/g, "&quot;");
}

function renderSvgNode(node: ChildNode | SvgNode): string {
  const [tag, attrs, children] = node;
  const attrString = Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(" ");

  if (children?.length) {
    return `<${tag} ${attrString}>${children.map(renderSvgNode).join("")}</${tag}>`;
  }

  return `<${tag} ${attrString} />`;
}

function getSimpleIcon(slug: string) {
  const pascal = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const key = `si${pascal}` as keyof typeof simpleIcons;
  return simpleIcons[key] as { title: string; path: string } | undefined;
}

function renderLucideIcon(node: IconNode, size: number, className?: string): string {
  const attrs: Record<string, string | number> = {
    ...SVG_DEFAULTS,
    width: size,
    height: size,
    "aria-hidden": "true",
  };
  if (className) attrs.class = className;
  return renderSvgNode(["svg", attrs, node as unknown as ChildNode[]]);
}

function renderSimpleIcon(slug: string, size: number, className?: string): string {
  const icon = getSimpleIcon(slug);
  if (!icon) return renderLucideIcon(Link, size, className);

  const attrs: Record<string, string | number> = {
    xmlns: "http://www.w3.org/2000/svg",
    role: "img",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
  };
  if (className) attrs.class = className;

  return renderSvgNode([
    "svg",
    attrs,
    [["path", { d: icon.path, fill: "currentColor" }]],
  ]);
}

export function normalizeLinkIcon(value: string | null | undefined): LinkIconId {
  const raw = (value ?? "").trim();
  if (!raw) return DEFAULT_LINK_ICON;

  const legacy = LEGACY_ICON_MAP[raw];
  if (legacy) return legacy;

  const id = raw.toLowerCase();
  if (id in LINK_ICONS) return id as LinkIconId;

  return DEFAULT_LINK_ICON;
}

export function sanitizeLinkIcon(value: unknown): LinkIconId {
  return normalizeLinkIcon(typeof value === "string" ? value : "");
}

export function suggestLinkIcon(url: string): LinkIconId {
  const input = url.trim();
  if (!input) return DEFAULT_LINK_ICON;

  try {
    const normalized = input.startsWith("http") ? input : `https://${input}`;
    const parsed = new URL(normalized);
    const haystack = `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`;

    for (const [pattern, iconId] of URL_ICON_RULES) {
      if (pattern.test(haystack)) return iconId;
    }
  } catch {
    for (const [pattern, iconId] of URL_ICON_RULES) {
      if (pattern.test(input)) return iconId;
    }
  }

  return DEFAULT_LINK_ICON;
}

export function renderLinkIconSvg(
  iconId: string | null | undefined,
  size = 18,
  className?: string,
): string {
  const id = normalizeLinkIcon(iconId);
  const entry = LINK_ICONS[id];

  if (entry.kind === "simple") {
    return renderSimpleIcon(entry.slug, size, className);
  }

  return renderLucideIcon(entry.node, size, className);
}

export function getLinkIconPickerItems() {
  return Object.entries(LINK_ICONS).map(([id, entry]) => ({
    id,
    label: entry.label,
    svg: renderLinkIconSvg(id, 18),
  }));
}

export function getUrlIconRulesForClient() {
  return URL_ICON_RULES.map(([pattern, iconId]) => [pattern.source, iconId]);
}
