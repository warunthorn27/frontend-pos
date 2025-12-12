import type { UserFormInput, UserListItem, UserModel } from "../types/user";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

function getToken() {
  // ✅ ต้องให้ชื่อ key ตรงกับตอน login ที่ set ไว้
  return localStorage.getItem("token") || "";
}

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { authtoken: token } : {}),
    // ✅ optional: รองรับมาตรฐาน Bearer ด้วย (ถ้า backend รองรับ)
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function mapUserToListItem(u: UserModel): UserListItem {
  return {
    id: u._id,
    name: u.user_name,
    email: u.user_email,
    phone: u.user_phone,
    status: u.status ? "active" : "inactive",
  };
}

async function readJson(res: Response) {
  // กันกรณี backend ตอบไม่ใช่ JSON
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text || "Invalid server response" };
  }
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

  const json = await readJson(res);

  if (!json.success) {
    throw new Error(json.message || "Failed to load users");
  }

  return (json.data as UserModel[]).map(mapUserToListItem);
}

// CREATE USER (คืน user ที่สร้างแล้ว)
export async function createUser(
  payload: UserFormInput
): Promise<UserListItem> {
  // ✅ กันกรณีไม่มี token
  if (!getToken()) {
    throw new Error("No token. Please login again.");
  }

  // ✅ ถ้าติ๊กส่งอีเมล แต่ไม่มี email -> ไม่ให้ยิง createandsend
  if (payload.sendPasswordEmail && !payload.email?.trim()) {
    throw new Error("Email is required to send password.");
  }

  const body = {
    user_name: payload.username,
    user_password: payload.password,
    user_email: payload.email,
    user_phone: payload.phone,
    user_role: "User",
    // ✅ ไม่ส่ง comp_id แล้ว ให้ backend ผูกจาก adminUser.comp_id
    permissions: [],
    status: payload.status === "active",
  };

  const endpoint = payload.sendPasswordEmail
    ? `${API_BASE}/createandsend-user`
    : `${API_BASE}/create-user`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const json = await readJson(res);

  if (!json.success) {
    // ✅ ช่วย debug 403/401 ได้ดีขึ้น
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    if (res.status === 403)
      throw new Error(json.message || "Forbidden (Admin only).");
    throw new Error(json.error || json.message || "Create user failed");
  }

  return mapUserToListItem(json.data as UserModel);
}

// UPDATE USER BY ADMIN
export async function updateUserByAdmin(
  id: string,
  payload: UserFormInput
): Promise<UserListItem> {
  const body = {
    user_name: payload.username,
    user_email: payload.email,
    user_phone: payload.phone,
    user_role: "User",
    permissions: [],
    status: payload.status === "active",
  };

  const res = await fetch(`${API_BASE}/update-user-byadmin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const json = await readJson(res);

  if (!json.success) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    if (res.status === 403)
      throw new Error(json.message || "Forbidden (Admin only).");
    throw new Error(json.error || json.message || "Update user failed");
  }

  return mapUserToListItem(json.data as UserModel);
}

// RESET PASSWORD (เลือกส่งเมลได้)
export async function resetPasswordByAdmin(
  id: string,
  newPassword: string,
  sendEmail: boolean
): Promise<{ message: string }> {
  const endpoint = sendEmail
    ? `${API_BASE}/resetpass-user-byadminsend/${id}`
    : `${API_BASE}/resetpass-user-byadmin/${id}`;

  const res = await fetch(endpoint, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_password: newPassword }),
  });

  const json = await readJson(res);

  if (!json.success) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    if (res.status === 403)
      throw new Error(json.message || "Forbidden (Admin only).");
    throw new Error(json.message || "Reset password failed");
  }

  return { message: json.message || "Reset password success" };
}

// CHANGE STATUS
export async function changeUserStatus(
  id: string,
  isActive: boolean
): Promise<UserListItem> {
  const res = await fetch(`${API_BASE}/changestatus-user/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: isActive }),
  });

  const json = await readJson(res);

  if (!json.success) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    if (res.status === 403)
      throw new Error(json.message || "Forbidden (Admin only).");
    throw new Error(json.message || "Change status failed");
  }

  return mapUserToListItem(json.data as UserModel);
}
