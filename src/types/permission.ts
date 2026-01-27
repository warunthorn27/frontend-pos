export type PermissionAction =
  | "view"
  | "add"
  | "update"
  | "delete"
  | "print"
  | "export";

export interface PermissionDTO {
  _id: string;
  permission_menu: string;
  permission_action: PermissionAction;
  permission_name?: string;
}

export type PermissionCatalog = Record<
  string, // menu
  Partial<Record<PermissionAction, PermissionDTO>>
>;

export type PermissionChecks = Record<PermissionAction, boolean> & {
  all: boolean;
};

export type PermissionChecksByMenu = Record<string, PermissionChecks>;
