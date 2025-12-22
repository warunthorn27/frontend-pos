import type { AuthUser, LoginResponse } from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

type LoginApiRawResponse = {
  success?: boolean;
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: "Admin" | "User";
    phone?: string;
    status?: boolean;
    permissionId?: string;
    companyId?: string | null;
  };
  forceChangePassword?: boolean;
  message?: string;
  error?: string;
};

function parseJsonOrText(text: string): LoginApiRawResponse {
  try {
    return JSON.parse(text) as LoginApiRawResponse;
  } catch {
    return { message: text };
  }
}

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

  // สำคัญ: backend error เป็น text ได้
  const text = await res.text();
  const data = parseJsonOrText(text);

  if (!res.ok) {
    throw new Error(data.message || data.error || "Login failed");
  }

  if (!data.token || !data.user) {
    throw new Error("Invalid login response");
  }

  const user: AuthUser = {
    id: String(data.user.id ?? ""),
    name: String(data.user.name ?? ""),
    email: String(data.user.email ?? ""),
    role: data.user.role ?? "User",
    phone: data.user.phone,
    status: Boolean(data.user.status),
    permissionId: data.user.permissionId
      ? String(data.user.permissionId)
      : undefined,
    companyId: data.user.companyId ? String(data.user.companyId) : null,
  };

  if (!user.id || !user.role) {
    throw new Error("Invalid user data from server");
  }

  return {
    success: Boolean(data.success),
    token: data.token,
    user,
    forceChangePassword: data.forceChangePassword,
    message: data.message,
  };
}

/** ใช้เป็นโครง response ที่มี message / success / error */
export interface ApiMessageResponse {
  success?: boolean;
  message: string;
  error?: string;
}

/** helper แปลง text เป็น ApiMessageResponse แบบ type-safe */
function parseApiMessageResponse(
  text: string,
  defaultError: string
): ApiMessageResponse {
  try {
    const parsed = JSON.parse(text) as Partial<ApiMessageResponse>;
    const message = parsed.message ?? parsed.error ?? (text || defaultError);

    return {
      success: parsed.success,
      message,
      error: parsed.error,
    };
  } catch {
    return { message: text || defaultError };
  }
}

export async function changeFirstPasswordApi(
  token: string,
  userId: string,
  newPassword: string
): Promise<ApiMessageResponse> {
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
  const data = parseApiMessageResponse(text, "Server error");

  if (!res.ok) {
    throw new Error(data.message || "Change password failed");
  }

  return data;
}

export async function forgotPasswordApi(
  email: string
): Promise<ApiMessageResponse> {
  const res = await fetch(`${API_BASE_URL}/request-reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const text = await res.text();
  const data = parseApiMessageResponse(text, "Request failed");

  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}
