/**
 * Aturan Validasi Akun & Input EVORA Engine
 */

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLen: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  errorMessage: string | null;
}

/**
 * Validasi ketentuan password sesuai standar EVORA Backend:
 * - Minimal 8 karakter, maksimal 128 karakter
 * - Wajib mengandung minimal 1 huruf besar (kapital)
 * - Wajib mengandung minimal 1 huruf kecil
 * - Wajib mengandung minimal 1 angka
 */
export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLen = password.length >= 8 && password.length <= 128;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isValid = hasMinLen && hasUpper && hasLower && hasNumber;
  let errorMessage: string | null = null;

  if (!hasMinLen) {
    errorMessage = "Kata sandi minimal 8 karakter.";
  } else if (!hasUpper) {
    errorMessage = "Kata sandi wajib mengandung minimal 1 huruf besar (A-Z).";
  } else if (!hasLower) {
    errorMessage = "Kata sandi wajib mengandung minimal 1 huruf kecil (a-z).";
  } else if (!hasNumber) {
    errorMessage = "Kata sandi wajib mengandung minimal 1 angka (0-9).";
  }

  return {
    isValid,
    hasMinLen,
    hasUpper,
    hasLower,
    hasNumber,
    errorMessage,
  };
}

