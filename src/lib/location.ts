export type ProfileLocation = {
  locationLat?: number | null;
  locationLng?: number | null;
  locationLabel?: string | null;
};

export function hasProfileLocation(profile: ProfileLocation): boolean {
  return (
    typeof profile.locationLat === "number" &&
    Number.isFinite(profile.locationLat) &&
    typeof profile.locationLng === "number" &&
    Number.isFinite(profile.locationLng)
  );
}

export function parseCoordinate(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(num)) return null;
  return num;
}

export function validateCoordinates(
  lat: number,
  lng: number,
): { ok: true } | { error: string } {
  if (lat < -90 || lat > 90) {
    return { error: "Latitude must be between -90 and 90." };
  }
  if (lng < -180 || lng > 180) {
    return { error: "Longitude must be between -180 and 180." };
  }
  return { ok: true };
}

export function getGoogleMapsApiKey(): string | undefined {
  const runtime = process.env.GOOGLE_MAPS_API_KEY;
  if (runtime?.trim()) return runtime.trim();

  const built = import.meta.env.GOOGLE_MAPS_API_KEY;
  if (typeof built === "string" && built.trim()) return built.trim();

  return undefined;
}

/** Google Maps Embed API — requires GOOGLE_MAPS_API_KEY and Maps Embed API enabled. */
export function getGoogleMapsEmbedUrl(
  lat: number,
  lng: number,
  apiKey: string,
  label?: string,
): string {
  const trimmedLabel = label?.trim();
  const q = trimmedLabel ? `${trimmedLabel}@${lat},${lng}` : `${lat},${lng}`;
  const params = new URLSearchParams({
    key: apiKey,
    q,
    zoom: "15",
  });
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}

export function getGoogleMapsUrl(lat: number, lng: number, label?: string): string {
  const trimmedLabel = label?.trim();
  const query = trimmedLabel ? `${trimmedLabel}@${lat},${lng}` : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}
