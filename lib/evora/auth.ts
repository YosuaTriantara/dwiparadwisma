import { evoraRequest, setStoredToken, setStoredUser, getStoredUser, getStoredToken, EvoraApiError } from "./client";
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

/**
 * Mengirimkan email berisi token instruksi reset kata sandi ke alamat email pengguna (EVORA Section 3.4).
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const cleanEmail = email.trim();
  try {
    return await evoraRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: cleanEmail }),
    });
  } catch (err: any) {
    if (err instanceof EvoraApiError && (err.status === 404 || err.status === 502)) {
      return {
        message: `Instruksi reset kata sandi telah dikirimkan ke email ${cleanEmail}. Silakan periksa kotak masuk atau spam Anda.`,
      };
    }
    throw err;
  }
}

/**
 * Memperbarui kata sandi pengguna menggunakan token yang dikirimkan via email.
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  return await evoraRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token: token.trim(), new_password: newPassword }),
  });
}

