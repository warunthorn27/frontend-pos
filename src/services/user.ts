import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserFormInput,
  UserListItem,
  UserModel,
  PermissionRef,
} from "../types/user";
import { API_BASE, getAuthHeaders } from "./apiClient";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

async function readJson<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return { success: false, message: text || "Invalid server response" };
  }
}

function extractPermissionIds(perms?: PermissionRef[]): string[] {
  if (!Array.isArray(perms)) return [];
  return perms.map((p) =>
    typeof p === "string" ? p : p && typeof p === "object" ? p._id : "",
  );
}

function mapUserToListItem(u: UserModel): UserListItem {
  return {
    id: u._id,
    name: u.user_name,
    email: u.user_email ?? "",
    phone: u.user_phone ?? "",
    status: u.status ? "active" : "inactive",
    permissions: extractPermissionIds(u.permissions),
    password: "*******",
  };
}

/* GET LIST */

export async function fetchUsers(): Promise<UserListItem[]> {
  const comp_id = localStorage.getItem("comp_id") || "";

  const res = await fetch(
    `${API_BASE}/user?comp_id=${comp_id}&user_role=User`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const json = await readJson<UserModel[]>(res);

  if (!json.success) {
    throw new Error(json.message || "Failed to load users");
  }

  return (json.data ?? []).map(mapUserToListItem);
}

/* GET ONE */

export async function fetchUserById(id: string): Promise<UserListItem> {
  const res = await fetch(`${API_BASE}/getone-user/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await readJson<UserModel>(res);

  if (!json.success || !json.data) {
    throw new Error(json.message || "Failed to load user");
  }

  return mapUserToListItem(json.data);
}

/* CREATE */

export async function createUser(
  payload: UserFormInput,
): Promise<UserListItem> {
  if (!payload.password) {
    throw new Error("Password is required for creating user.");
  }

  if (payload.sendPasswordEmail && !payload.email?.trim()) {
    throw new Error("Email is required to send password.");
  }

  const body: CreateUserRequest = {
    user_name: payload.username,
    user_password: payload.password,
    user_role: "User",
    permissions: payload.permissions,
    status: payload.status === "active",
  };

  const email = payload.email?.trim();
  const phone = payload.phone?.trim();

  if (email) body.user_email = email;
  if (phone) body.user_phone = phone;

  const endpoint = payload.sendPasswordEmail
    ? `${API_BASE}/createandsend-user`
    : `${API_BASE}/create-user`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const json = await readJson<UserModel>(res);

  if (!json.success || !json.data) {
    throw new Error(json.error || json.message || "Create user failed");
  }

  return mapUserToListItem(json.data);
}

/* UPDATE */

export async function updateUserByAdmin(
  id: string,
  payload: UserFormInput,
): Promise<UserListItem> {
  const body: UpdateUserRequest = {
    user_name: payload.username,
    permissions: payload.permissions,
    status: payload.status === "active",
    user_role: "User",
  };

  const email = payload.email?.trim();
  const phone = payload.phone?.trim();

  if (email) body.user_email = email;
  if (phone) body.user_phone = phone;

  const res = await fetch(`${API_BASE}/update-user-byadmin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const json = await readJson<UserModel>(res);

  if (!json.success || !json.data) {
    throw new Error(json.error || json.message || "Update user failed");
  }

  return mapUserToListItem(json.data);
}

/* CHANGE STATUS */

export async function changeUserStatus(
  id: string,
  isActive: boolean,
): Promise<UserListItem> {
  const res = await fetch(`${API_BASE}/changestatus-user/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: isActive }),
  });

  const json = await readJson<UserModel>(res);

  if (!json.success || !json.data) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    if (res.status === 403)
      throw new Error(json.message || "Forbidden (Admin only).");
    throw new Error(json.error || json.message || "Change status failed");
  }

  return mapUserToListItem(json.data);
}

/* RESET PASSWORD */

export async function resetPasswordByAdmin(
  id: string,
  newPassword: string,
  sendEmail: boolean,
): Promise<{ message: string }> {
  const endpoint = sendEmail
    ? `${API_BASE}/resetpass-user-byadminsend/${id}`
    : `${API_BASE}/resetpass-user-byadmin/${id}`;

  const res = await fetch(endpoint, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_password: newPassword }),
  });

  const json = await readJson<unknown>(res);

  if (!json.success) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    if (res.status === 403)
      throw new Error(json.message || "Forbidden (Admin only).");
    throw new Error(json.message || "Reset password failed");
  }

  return { message: json.message || "Reset password success" };
}
