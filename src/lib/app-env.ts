function readEnv(name: "APP_DOMAIN" | "APP_URL"): string | undefined {
  const runtime = process.env[name];
  if (runtime && runtime.trim()) return runtime.trim();

  const built = import.meta.env[name];
  if (typeof built === "string" && built.trim()) return built.trim();

  return undefined;
}

export function getAppDomain(): string {
  return readEnv("APP_DOMAIN") ?? "localhost";
}

export function getAppUrl(): string {
  return readEnv("APP_URL") ?? "http://localhost:4321";
}

export function getSlugSuffix(): string {
  const appDomain = getAppDomain();
  return appDomain === "localhost" ? ".localhost" : `.${appDomain}`;
}

export function getPublicProfileUrl(slug: string): string {
  const appDomain = getAppDomain();
  const appUrl = getAppUrl();

  if (appDomain === "localhost") {
    return `${appUrl}/p/${slug}`;
  }

  return `https://${slug}.${appDomain}`;
}

export function getProfilePreviewPath(slug: string): string {
  return `/p/${slug}`;
}
