import { evoraRequest, setStoredToken, setStoredUser, getStoredUser, getStoredToken } from "./client";
import type { AuthResponse, RegisterResponse, EvoraUser } from "@/types/evora";

export async function registerParticipant(
  fullName: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  return await evoraRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
    }),
  });
}

export async function loginParticipant(
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await evoraRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setStoredToken(data.access_token);
  setStoredUser(data.user);
  return data;
}

export async function loginWithGoogle(credential: string): Promise<AuthResponse> {
  const data = await evoraRequest<AuthResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });

  setStoredToken(data.access_token);
  setStoredUser(data.user);
  return data;
}

export function logoutParticipant() {
  setStoredToken(null);
  setStoredUser(null);
}

export function getCurrentUser(): EvoraUser | null {
  return getStoredUser();
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

