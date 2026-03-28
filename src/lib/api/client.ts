function hasPlaceholderSegments(value: string): boolean {
  return /(your-|placeholder|example\.com|temp-|changeme|replace-me|replace_with)/i.test(value);
}

function resolveApiBase(): string {
  const rawValue = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  if (!rawValue || hasPlaceholderSegments(rawValue)) {
    return "";
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawValue);
  } catch {
    return "";
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return "";
  }

  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    parsedUrl.protocol === "http:"
  ) {
    // Avoid mixed-content failures on secure deployments.
    return "";
  }

  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    /^(localhost|127\.0\.0\.1)$/i.test(parsedUrl.hostname)
  ) {
    // In production over HTTPS, localhost is unreachable from user devices.
    return "";
  }

  if (
    typeof window !== "undefined" &&
    parsedUrl.origin === window.location.origin
  ) {
    // Same origin does not need absolute URLs.
    return "";
  }

  return rawValue.replace(/\/+$/, "");
}

const apiBase = resolveApiBase();
let didLogFallback = false;

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function apiUrl(path: string): string {
  const normalizedPath = normalizePath(path);
  return apiBase ? `${apiBase}${normalizedPath}` : normalizedPath;
}

function shouldFallbackToSameOrigin(path: string, error: unknown): boolean {
  if (!apiBase) return false;
  if (typeof window === "undefined") return false;
  if (!(error instanceof TypeError)) return false;

  return path.startsWith("/api/");
}

/**
 * Wrapper around fetch for app-internal API routes.
 * If an external API base is misconfigured/unreachable, retry once against same-origin.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const normalizedPath = normalizePath(path);

  try {
    return await fetch(apiUrl(normalizedPath), init);
  } catch (error) {
    if (!shouldFallbackToSameOrigin(normalizedPath, error)) {
      throw error;
    }

    if (!didLogFallback) {
      didLogFallback = true;
      console.warn("Primary API base failed; retrying same-origin API routes.", {
        apiBase,
      });
    }

    return fetch(normalizedPath, init);
  }
}
