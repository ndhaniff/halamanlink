// Halamanlink — shared primitives, icons, logo, sample data, theme presets.

// ─── Logo ────────────────────────────────────────────────────────────────
function HLLogo({ size = 22, color = "currentColor" }) {
  // Abstract: two interlinked circles, lightly offset. Reads as 'link'
  // without being literal chain links. Plant-free as requested.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="12" r="5.5" stroke={color} strokeWidth="1.6" />
      <circle cx="15" cy="12" r="5.5" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.6" fill={color} />
    </svg>
  );
}

function HLWordmark({ size = 18, color = "currentColor" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color }}>
      <HLLogo size={size * 1.25} color={color} />
      <span style={{
        fontFamily: "var(--hl-font-display)",
        fontSize: size * 1.35,
        letterSpacing: "-0.015em",
        lineHeight: 1,
      }}>halamanlink</span>
    </div>
  );
}

// ─── Tiny icon set (stroked, 1.6, round caps) ────────────────────────────
const _icon = (paths, viewBox = "0 0 24 24") => ({ size = 16, color = "currentColor", strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke={color}
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths}
  </svg>
);

const Icon = {
  Link: _icon(<><path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1.2 1.2" /><path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1.2-1.2" /></>),
  Grip: _icon(<><circle cx="9" cy="6" r=".7" fill="currentColor"/><circle cx="9" cy="12" r=".7" fill="currentColor"/><circle cx="9" cy="18" r=".7" fill="currentColor"/><circle cx="15" cy="6" r=".7" fill="currentColor"/><circle cx="15" cy="12" r=".7" fill="currentColor"/><circle cx="15" cy="18" r=".7" fill="currentColor"/></>),
  Plus: _icon(<><path d="M12 5v14M5 12h14"/></>),
  Trash: _icon(<><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></>),
  Pencil: _icon(<><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/></>),
  Chart: _icon(<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>),
  Palette: _icon(<><path d="M12 3a9 9 0 1 0 0 18c1.7 0 2.3-1.4 1.5-2.6-.8-1.2-.3-2.4 1-2.4H17a4 4 0 0 0 4-4 9 9 0 0 0-9-9z"/><circle cx="8" cy="11" r="1" fill="currentColor"/><circle cx="12" cy="7" r="1" fill="currentColor"/><circle cx="16" cy="11" r="1" fill="currentColor"/></>),
  Settings: _icon(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>),
  Credit: _icon(<><rect x="2" y="6" width="20" height="13" rx="2.5"/><path d="M2 11h20M6 16h3"/></>),
  Bell: _icon(<><path d="M6 8a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 21a2 2 0 0 0 4 0"/></>),
  Search: _icon(<><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></>),
  Check: _icon(<><path d="M5 12l5 5 9-11"/></>),
  ArrowRight: _icon(<><path d="M5 12h14M13 5l7 7-7 7"/></>),
  ArrowUp: _icon(<><path d="M7 14l5-5 5 5"/></>),
  ArrowUpRight: _icon(<><path d="M7 17 17 7M9 7h8v8"/></>),
  External: _icon(<><path d="M15 3h6v6M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></>),
  Share: _icon(<><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/></>),
  Eye: _icon(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>),
  Copy: _icon(<><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M3 16V5a2 2 0 0 1 2-2h11"/></>),
  Globe: _icon(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>),
  Lock: _icon(<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></>),
  Sparkle: _icon(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>),
  Spotify: _icon(<><circle cx="12" cy="12" r="9"/><path d="M7 10c3-1 8-1 11 1M7.5 13c2.5-.8 6.5-.6 9 1M8 16c2-.6 5-.4 7 .8"/></>),
  Youtube: _icon(<><rect x="2.5" y="6" width="19" height="12" rx="3"/><path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor"/></>),
  Mail: _icon(<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>),
  Cal: _icon(<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>),
  Music: _icon(<><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="16" r="2.5"/><path d="M8.5 18V6l12-2v12"/></>),
  Headphones: _icon(<><path d="M4 16v-4a8 8 0 1 1 16 0v4"/><rect x="2.5" y="14" width="5" height="6" rx="1.5"/><rect x="16.5" y="14" width="5" height="6" rx="1.5"/></>),
  Book: _icon(<><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z"/></>),
  Camera: _icon(<><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6l1.5-2h5L16 6"/></>),
  Heart: _icon(<><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></>),
  Coffee: _icon(<><path d="M4 8h14v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M18 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2"/></>),
  Logout: _icon(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H10"/></>),
  Filter: _icon(<><path d="M4 5h16l-6 8v6l-4-2v-4z"/></>),
  Dot: _icon(<><circle cx="12" cy="12" r="2" fill="currentColor"/></>),
  Chevron: _icon(<><path d="m6 9 6 6 6-6"/></>),
  ChevronR: _icon(<><path d="m9 6 6 6-6 6"/></>),
  Close: _icon(<><path d="M6 6l12 12M18 6L6 18"/></>),
  Drag: _icon(<><circle cx="9" cy="6" r=".9" fill="currentColor"/><circle cx="9" cy="12" r=".9" fill="currentColor"/><circle cx="9" cy="18" r=".9" fill="currentColor"/><circle cx="15" cy="6" r=".9" fill="currentColor"/><circle cx="15" cy="12" r=".9" fill="currentColor"/><circle cx="15" cy="18" r=".9" fill="currentColor"/></>),
};

// ─── Sample profile data ─────────────────────────────────────────────────
const SAMPLE_PROFILE = {
  displayName: "Maya Hernandez",
  handle: "mayahern",
  bio: "Ceramicist & cookbook author. Slow living, slower coffee. Currently in Lisbon.",
  avatarInitials: "MH",
  links: [
    { id: "l1", title: "New cookbook — pre-order", url: "morningbread.shop", icon: "Book",   clicks: 4821, active: true,  hot: true  },
    { id: "l2", title: "Studio newsletter",        url: "studio.maya.co",   icon: "Mail",   clicks: 2104, active: true,  hot: false },
    { id: "l3", title: "Pottery class — June",     url: "lisbonclay.com",   icon: "Cal",    clicks: 1387, active: true,  hot: false },
    { id: "l4", title: "Listen — Slow Mornings",   url: "open.spotify.com", icon: "Spotify",clicks:  962, active: true,  hot: false },
    { id: "l5", title: "Instagram",                url: "instagram.com/m",  icon: "Camera", clicks:  743, active: true,  hot: false },
    { id: "l6", title: "Behind the kiln (draft)",  url: "youtube.com/@m",   icon: "Youtube",clicks:    0, active: false, hot: false },
  ],
};

// ─── Theme presets for the public profile ────────────────────────────────
// Each theme: page bg, card surface, ink, muted ink, button bg/fg, accent
const THEMES = {
  cream: {
    name: "Linen",
    bg: "oklch(0.965 0.018 82)",
    surface: "oklch(0.99 0.01 82)",
    ink: "oklch(0.22 0.02 60)",
    muted: "oklch(0.5 0.018 65)",
    btnBg: "oklch(0.99 0.01 82)",
    btnFg: "oklch(0.22 0.02 60)",
    btnBorder: "oklch(0.86 0.018 76)",
    accent: "oklch(0.58 0.092 48)",
    swatch: ["oklch(0.965 0.018 82)", "oklch(0.78 0.082 50)", "oklch(0.22 0.02 60)"],
    radius: 18,
    font: "var(--hl-font-display)",
  },
  sage: {
    name: "Sage",
    bg: "oklch(0.93 0.03 145)",
    surface: "oklch(0.97 0.018 145)",
    ink: "oklch(0.28 0.03 148)",
    muted: "oklch(0.48 0.03 148)",
    btnBg: "oklch(0.97 0.018 145)",
    btnFg: "oklch(0.28 0.03 148)",
    btnBorder: "oklch(0.78 0.04 145)",
    accent: "oklch(0.48 0.078 148)",
    swatch: ["oklch(0.93 0.03 145)", "oklch(0.72 0.068 145)", "oklch(0.28 0.03 148)"],
    radius: 14,
    font: "var(--hl-font-ui)",
  },
  dusk: {
    name: "Dusk",
    bg: "oklch(0.27 0.03 320)",
    surface: "oklch(0.32 0.04 320)",
    ink: "oklch(0.96 0.018 320)",
    muted: "oklch(0.72 0.03 320)",
    btnBg: "oklch(0.34 0.04 320)",
    btnFg: "oklch(0.96 0.018 320)",
    btnBorder: "oklch(0.4 0.05 320)",
    accent: "oklch(0.78 0.12 60)",
    swatch: ["oklch(0.27 0.03 320)", "oklch(0.78 0.12 60)", "oklch(0.96 0.018 320)"],
    radius: 12,
    font: "var(--hl-font-ui)",
  },
  clay: {
    name: "Clay",
    bg: "oklch(0.91 0.04 50)",
    surface: "oklch(0.96 0.02 50)",
    ink: "oklch(0.3 0.04 45)",
    muted: "oklch(0.5 0.04 48)",
    btnBg: "oklch(0.96 0.02 50)",
    btnFg: "oklch(0.3 0.04 45)",
    btnBorder: "oklch(0.78 0.05 50)",
    accent: "oklch(0.58 0.092 48)",
    swatch: ["oklch(0.91 0.04 50)", "oklch(0.58 0.092 48)", "oklch(0.3 0.04 45)"],
    radius: 22,
    font: "var(--hl-font-display)",
  },
  noir: {
    name: "Noir",
    bg: "oklch(0.18 0.005 60)",
    surface: "oklch(0.22 0.006 60)",
    ink: "oklch(0.96 0.01 80)",
    muted: "oklch(0.68 0.01 70)",
    btnBg: "oklch(0.22 0.006 60)",
    btnFg: "oklch(0.96 0.01 80)",
    btnBorder: "oklch(0.32 0.008 60)",
    accent: "oklch(0.85 0.13 95)",
    swatch: ["oklch(0.18 0.005 60)", "oklch(0.85 0.13 95)", "oklch(0.96 0.01 80)"],
    radius: 6,
    font: "var(--hl-font-mono)",
  },
};

// ─── Small helpers ───────────────────────────────────────────────────────
function fmt(n) { return n.toLocaleString("en-US"); }

// Export to window for cross-script use
Object.assign(window, {
  HLLogo, HLWordmark, Icon, SAMPLE_PROFILE, THEMES, fmt,
});
