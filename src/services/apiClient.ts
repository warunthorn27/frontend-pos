import { getToken } from "../utils/authStorage";

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

/**
 * ใช้กับ fetch / axios
 * Backend รองรับทั้ง Authorization และ authtoken
 */
export function getAuthHeaders(extra?: Record<string, string>) {
  const token = getToken();

  return {
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
          authtoken: token,
        }
      : {}),
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || "Invalid JSON response");
  }
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export async function fetchWithAuth<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    throw new UnauthorizedError("Session expired");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || "Request failed");
  }

  return readJson<T>(res);
}
