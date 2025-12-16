export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}

export interface UserFormInput {
  username: string;
  password: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  sendPasswordEmail: boolean;
  permissionInventory: {
    all: boolean;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
    export: boolean;
  };
}

// DB model จาก backend
export interface UserModel {
  _id: string;
  user_name: string;
  user_email?: string;
  user_phone?: string;
  status: boolean;
  permissions?: unknown[];
  comp_id?: unknown;
  user_role?: string;
}

// API request types (ไว้ใช้ใน services)
export type CreateUserRequest = {
  user_name: string;
  user_password: string;
  user_role: "User";
  permissions: unknown[];
  status: boolean;
  user_email?: string;
  user_phone?: string;
};

export type UpdateUserRequest = {
  user_name: string;
  user_role: "User";
  permissions: unknown[];
  status: boolean;
  user_email?: string;
  user_phone?: string;
};
