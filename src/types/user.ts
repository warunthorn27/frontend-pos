export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  permissions: string[]; // เก็บเป็น permission ids เสมอ
  password: string;
}

export interface PaginatedUsers {
  data: UserListItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type UserFormInput = {
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  status: "active" | "inactive";
  permissions: string[];
  sendPasswordEmail?: boolean;
};

export type CreateUserInput = {
  username: string;
  password: string; // REQUIRED
  email?: string;
  phone?: string;
  status: "active" | "inactive";
  permissions: string[];
  sendPasswordEmail?: boolean;
};

export type UpdateUserInput = {
  username: string;
  password?: string; // OPTIONAL
  email?: string;
  phone?: string;
  status: "active" | "inactive";
  permissions: string[];
  sendPasswordEmail?: boolean;
};

export type PermissionRef = string | { _id: string };

export interface UserModel {
  _id: string;
  user_name: string;
  user_email?: string;
  user_phone?: string;
  status: boolean;
  permissions?: PermissionRef[];
  comp_id?: unknown;
  user_role?: string;
}

// API request types (ไว้ใช้ใน services)
export type CreateUserRequest = {
  user_name: string;
  user_password: string;
  user_role: "User";
  permissions: string[];
  status: boolean;
  user_email?: string;
  user_phone?: string;
};

export type UpdateUserRequest = {
  user_name: string;
  user_role: "User";
  permissions: string[];
  status: boolean;
  user_email?: string;
  user_phone?: string;
};
