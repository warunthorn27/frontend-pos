export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  phone?: string;
  status: boolean;
  permissionId?: string;
  companyId?: string | null;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  forceChangePassword?: boolean;
  message?: string;
}
