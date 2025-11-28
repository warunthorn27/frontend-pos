import type { AuthUser, LoginResponse } from "../types/auth";

const API_BASE_URL = "http://localhost:3000/api";

export async function loginApi(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier,
      user_password: password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Login failed");
  }

  const user: AuthUser = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    phone: data.user.phone,
    status: data.user.status,
    permissionId: data.user.permissionId,
    companyId: data.user.companyId,
  };

  return {
    success: data.success,
    token: data.token,
    user,
    forceChangePassword: data.forceChangePassword,
    message: data.message,
  };
}

export async function changeFirstPasswordApi(
  token: string,
  userId: string,
  newPassword: string
) {
  const res = await fetch(
    `${API_BASE_URL}/changefirstpassword-user/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({ new_password: newPassword }),
    }
  );

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text || "Server error" };
  }

  if (!res.ok) {
    throw new Error(data.message || "Change password failed");
  }

  return data;
}
