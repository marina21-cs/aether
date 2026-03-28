function resolveApiBase(): string {
  const rawValue = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  const normalized = rawValue.replace(/\/$/, "");

  if (!normalized) return "";

  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)
  ) {
    // In production over HTTPS, a localhost API base is unreachable; use same-origin /api instead.
    return "";
  }

  return normalized;
}

const apiBase = resolveApiBase();

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return apiBase ? `${apiBase}${normalizedPath}` : normalizedPath;
}
