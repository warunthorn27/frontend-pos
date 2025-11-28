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
  };
}

export interface UserModel {
  _id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  status: boolean; // true/false จาก DB
  permissions?: unknown[]; // populated permissions
  comp_id?: unknown; // populated company
  user_role?: string;
}
