export type Status = "active" | "inactive";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: Status;
}

export interface UserFormValues {
  username: string;
  password: string;
  email: string;
  phone: string;
  status: Status;
  sendPasswordEmail: boolean;
  permissionInventory: {
    all: boolean;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
}
