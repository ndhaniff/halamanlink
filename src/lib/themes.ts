import { getPlanLimits } from "./plans";

export type ThemePreset = {
  name: string;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  btnBg: string;
  btnFg: string;
  btnBorder: string;
  accent: string;
  radius: number;
  font: string;
  swatch: string[];
};

export const THEME_PRESETS: Record<string, ThemePreset> = {
  cream: {
    id: "cream",
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
    id: "sage",
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
    id: "dusk",
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
    id: "clay",
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
    id: "noir",
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
  plum: {
    id: "plum",
    name: "Plum",
    bg: "oklch(0.93 0.024 340)",
    surface: "oklch(0.97 0.018 340)",
    ink: "oklch(0.28 0.04 340)",
    muted: "oklch(0.52 0.04 340)",
    btnBg: "oklch(0.97 0.018 340)",
    btnFg: "oklch(0.28 0.04 340)",
    btnBorder: "oklch(0.82 0.04 340)",
    accent: "oklch(0.55 0.078 340)",
    swatch: ["oklch(0.93 0.024 340)", "oklch(0.55 0.078 340)", "oklch(0.28 0.04 340)"],
    radius: 16,
    font: "var(--hl-font-display)",
  },
  mist: {
    id: "mist",
    name: "Mist",
    bg: "oklch(0.97 0.008 84)",
    surface: "oklch(0.99 0.006 84)",
    ink: "oklch(0.28 0.02 148)",
    muted: "oklch(0.52 0.02 145)",
    btnBg: "oklch(0.99 0.006 84)",
    btnFg: "oklch(0.28 0.02 148)",
    btnBorder: "oklch(0.88 0.012 145)",
    accent: "oklch(0.72 0.068 145)",
    swatch: ["oklch(0.97 0.008 84)", "oklch(0.72 0.068 145)", "oklch(0.28 0.02 148)"],
    radius: 20,
    font: "var(--hl-font-ui)",
  },
};

const LEGACY_THEME_MAP: Record<string, string> = {
  minimal: "cream",
  dark: "dusk",
  gradient: "clay",
  bold: "clay",
};

export const DEFAULT_THEME = THEME_PRESETS.cream;

export function parseTheme(value: unknown): ThemePreset {
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id: string }).id;
    const mapped = LEGACY_THEME_MAP[id] ?? id;
    if (THEME_PRESETS[mapped]) return THEME_PRESETS[mapped];
  }
  return DEFAULT_THEME;
}

export function getAvailableThemes(plan: "free" | "pro"): ThemePreset[] {
  const limits = getPlanLimits(plan);
  const all = Object.values(THEME_PRESETS);
  if (limits.themeIds === "all") return all;
  return all.filter((t) => limits.themeIds.includes(t.id));
}

export function isDarkTheme(theme: ThemePreset): boolean {
  return theme.id === "dusk" || theme.id === "noir";
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
