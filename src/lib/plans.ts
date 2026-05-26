export type PlanId = "free" | "pro";

export type PlanLimits = {
  maxLinks: number;
  themeIds: string[] | "all";
  analyticsDays: number;
  customDomains: number;
};

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    maxLinks: 7,
    themeIds: ["cream", "sage", "dusk", "clay", "noir"],
    analyticsDays: 7,
    customDomains: 0,
  },
  pro: {
    maxLinks: Infinity,
    themeIds: "all",
    analyticsDays: 30,
    customDomains: 1,
  },
};

export function getPlanLimits(plan: PlanId): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function canUseTheme(plan: PlanId, themeId: string): boolean {
  const limits = getPlanLimits(plan);
  if (limits.themeIds === "all") return true;
  return limits.themeIds.includes(themeId);
}

export function canAddLink(plan: PlanId, currentCount: number): boolean {
  return currentCount < getPlanLimits(plan).maxLinks;
}

export function canAddCustomDomain(plan: PlanId, currentCount: number): boolean {
  return currentCount < getPlanLimits(plan).customDomains;
}

export function getAnalyticsDays(plan: PlanId): number {
  return getPlanLimits(plan).analyticsDays;
}
