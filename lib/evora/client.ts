/**
 * EVORA API HTTP Client
 * Menangani komunikasi dengan backend EVORA Engine (Lokal: http://localhost:8080 / Prod: api.events.my.id)
 */

export const EVORA_BASE_URL =
  process.env.EVORA_API_URL ||
  process.env.NEXT_PUBLIC_EVORA_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.events.my.id"
    : "http://localhost:8080");

export const EVORA_EVENT_SLUG =
  process.env.EVORA_EVENT_ID ||
  process.env.NEXT_PUBLIC_EVORA_EVENT_ID ||
  "lkbb-bramasta-4";

const TOKEN_KEY = "evora_auth_token";
const USER_KEY = "evora_user_data";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setStoredUser(user: any | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export async function evoraRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Di browser (client-side), gunakan internal proxy /api/evora agar bebas CORS
  const baseUrl =
    typeof window !== "undefined"
      ? "/api/evora"
      : EVORA_BASE_URL;

  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Di development, gunakan cache: "no-store" agar data dari localhost:8080 selalu real-time
  const fetchConfig: RequestInit = {
    ...options,
    headers,
    cache: process.env.NODE_ENV === "development" ? "no-store" : options.cache,
    next:
      process.env.NODE_ENV === "development"
        ? { revalidate: 0 }
        : options.next || { revalidate: 60 },
  };

  try {
    const res = await fetch(url, fetchConfig);
    const data = await res.json().catch(() => null);

    if (process.env.NODE_ENV === "development") {
      console.log(`[EVORA API] ${options.method || "GET"} ${url} -> ${res.status}`);
    }

    if (!res.ok) {
      const errorMsg =
        data?.error || data?.message || `Request gagal dengan status ${res.status}`;
      throw new Error(errorMsg);
    }

    // Mendukung baik format direct payload maupun { data: ... }
    if (
      data &&
      typeof data === "object" &&
      "data" in data &&
      !("id" in data && "name" in data)
    ) {
      return (data as any).data as T;
    }

    return data as T;
  } catch (err: any) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[EVORA API Error] ${options.method || "GET"} ${url}: ${err.message}`);
    }
    throw err;
  }
}
