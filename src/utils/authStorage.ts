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

  const cid = data.user.companyId;

  // สำคัญ: ถ้าไม่มี companyId ต้องลบ comp_id เดิมทิ้ง
  if (cid) {
    localStorage.setItem(COMP_KEY, String(cid));
  } else {
    localStorage.removeItem(COMP_KEY);
  }
}

export function clearAuth() {
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

export function setCurrentUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
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

  // sync user object
  const u = getCurrentUser();
  if (u) {
    const next: AuthUser = { ...u, companyId };
    setCurrentUser(next);
  }
}

export function getCompanyId(): string | null {
  return localStorage.getItem(COMP_KEY);
}
