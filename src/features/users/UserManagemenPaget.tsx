import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import UserForm from "./UserForm";
import useUsers from "./hook/useUsers";
import type { UserFormInput, UserListItem } from "../../types/user";
import UserModal from "./UserModal";
import ResetPasswordDialog from "../../features/users/ResetPasswordDialog";

const UserManagementPage: React.FC = () => {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetUser, setResetUser] = useState<UserListItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [formMode, setFormMode] = useState<"view" | "edit">("view");

  const {
    users,
    createUser,
    loadUsers,
    updateUser,
    resetPassword,
    toggleStatus,
    getUserById,
    permissionMenus,
    permissionCatalog,
  } = useUsers();

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <>
      {mode === "list" && (
        <UserList
          users={users}
          onCreateUser={() => setMode("create")}
          onViewUser={async (u) => {
            const latest = await getUserById(u.id);
            setEditingUser(latest);
            setFormMode("view");
            setEditOpen(true);
          }}
          onEditUser={async (u) => {
            const latest = await getUserById(u.id);
            setFormMode("edit");
            setEditingUser(latest);
            setEditOpen(true);
          }}
          onToggleStatus={(u, active) => toggleStatus(u.id, active)}
          onResetPassword={(u) => {
            setResetUser(u);
            setResetOpen(true);
          }}
          maxUsers={3}
          search={search}
          onChangeSearch={setSearch}
          onPrint={() => console.log("print")}
          onExportExcel={() => console.log("export")}
        />
      )}

      {mode === "create" && (
        <UserForm
          menus={permissionMenus}
          permissionCatalog={permissionCatalog}
          onCancel={() => setMode("list")}
          onSubmit={async (values: UserFormInput) => {
            await createUser(values);
            setMode("list");
          }}
        />
      )}

      {/* edit modal */}
      <UserModal
        open={editOpen}
        user={editingUser!}
        mode={formMode}
        menus={permissionMenus}
        permissionCatalog={permissionCatalog}
        onEdit={() => setFormMode("edit")}
        onClose={() => {
          setEditOpen(false);
          setEditingUser(null);
          setFormMode("view");
        }}
        onSubmit={async (values) => {
          await updateUser(editingUser!.id, values);

          if (values.password?.trim()) {
            await resetPassword(
              editingUser!.id,
              values.password,
              values.sendPasswordEmail ?? false,
            );
          }

          setEditOpen(false);
          setEditingUser(null);
          setFormMode("view");
        }}
      />

      <ResetPasswordDialog
        open={resetOpen}
        user={resetUser}
        onClose={() => setResetOpen(false)}
        onResetPassword={resetPassword}
      />
    </>
  );
};

export default UserManagementPage;
