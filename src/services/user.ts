import type { UserFormInput, UserListItem, UserModel } from "../types/user";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { authtoken: token } : {}),
  };
}

// GET LIST OF USERS
export async function fetchUsers(): Promise<UserListItem[]> {
  const comp_id = localStorage.getItem("comp_id");

  const res = await fetch(
    `${API_BASE}/user?comp_id=${comp_id}&user_role=User`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to load users");
  }

  const mapped: UserListItem[] = json.data.map((u: UserModel) => ({
    id: u._id,
    name: u.user_name,
    email: u.user_email,
    phone: u.user_phone,
    status: u.status ? "active" : "inactive",
  }));

  return mapped;
}

// CREATE USER
export async function createUser(payload: UserFormInput): Promise<void> {
  const comp_id = localStorage.getItem("comp_id");

  const body = {
    user_name: payload.username,
    user_password: payload.password,
    user_email: payload.email,
    user_phone: payload.phone,
    user_role: "User",
    comp_id,
    permissions: [],
  };

  const res = await fetch(`${API_BASE}/create-user`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || json.message || "Create user failed");
  }
}

// UPDATE USER BY ADMIN
export async function updateUserByAdmin(
  id: string,
  payload: UserFormInput
): Promise<void> {
  const body = {
    user_name: payload.username,
    user_email: payload.email,
    user_phone: payload.phone,
    user_role: "User",
    permissions: [],
  };

  const res = await fetch(`${API_BASE}/update-user-byadmin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || json.message || "Update user failed");
  }
}

// RESET PASSWORD
export async function resetPasswordByAdmin(
  id: string,
  newPassword: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/resetpass-user-byadmin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_password: newPassword }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Reset password failed");
  }
}

// CHANGE STATUS
export async function changeUserStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  const res = await fetch(`${API_BASE}/changestatus-user/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: isActive }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Change status failed");
  }
}
