import type { LoginResponse, AuthUser } from "../types/auth";

const TOKEN_KEY = "token";
const USER_KEY = "current_user";
const FORCE_KEY = "force_change_password";
const COMP_KEY = "comp_id";

export type Role = "Admin" | "User";

export function saveAuth(data: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  localStorage.setItem(
    FORCE_KEY,
    JSON.stringify(Boolean(data.forceChangePassword))
  );

  if (data.user.companyId) {
    localStorage.setItem(COMP_KEY, data.user.companyId);
  }
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(FORCE_KEY);
  localStorage.removeItem(COMP_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getForceChangePassword(): boolean {
  const raw = localStorage.getItem(FORCE_KEY);
  if (!raw) return false;
  try {
    return Boolean(JSON.parse(raw));
  } catch {
    return false;
  }
}

export function setForceChangePassword(next: boolean) {
  localStorage.setItem(FORCE_KEY, JSON.stringify(Boolean(next)));
}

export function setCompanyId(companyId: string) {
  localStorage.setItem(COMP_KEY, companyId);

  // update user object (ให้ currentUser.companyId ไม่หลุด)
  const u = getCurrentUser();
  if (u) {
    const next = { ...u, companyId };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
  }
}

export function getCompanyId(): string | null {
  return localStorage.getItem(COMP_KEY);
}
