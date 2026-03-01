import React, { useMemo, useState } from "react";
import UserForm from "./UserForm";
import useUsers from "./hook/useUsers";
import type { UserFormInput, UserListItem } from "../../types/user";
import UserModal from "./UserModal";
import ResetPasswordDialog from "../../features/users/ResetPasswordDialog";
import UserListContainer from "./UserListContainer";

const UserManagementPage: React.FC = () => {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetUser, setResetUser] = useState<UserListItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [formMode, setFormMode] = useState<"view" | "edit">("view");
  const [search, setSearch] = useState("");

  const {
    users,
    page,
    pageSize,
    total,
    totalPages,
    setPage,
    setPageSize,
    createUser,
    updateUser,
    resetPassword,
    getUserById,
    permissionMenus,
    permissionCatalog,
  } = useUsers();

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    const keyword = search.toLowerCase();

    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword) ||
        u.phone?.toLowerCase().includes(keyword),
    );
  }, [users, search]);

  return (
    <>
      {mode === "list" && (
        <UserListContainer
          users={filteredUsers}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          setPage={setPage}
          setPageSize={setPageSize}
          search={search}
          onChangeSearch={setSearch}
          maxUsers={3}
          onCreateUser={() => setMode("create")}
          onPrint={() => window.print()}
          onExportExcel={() => console.log("Export Excel")}
          onViewUser={async (u) => {
            const latest = await getUserById(u.id);
            setEditingUser(latest);
            setFormMode("view");
            setEditOpen(true);
          }}
          onEditUser={async (u) => {
            const latest = await getUserById(u.id);
            setEditingUser(latest);
            setFormMode("edit");
            setEditOpen(true);
          }}
          onResetPassword={(u) => {
            setResetUser(u);
            setResetOpen(true);
          }}
        />
      )}

      {mode === "create" && (
        <UserForm
          mode="create"
          menus={permissionMenus}
          permissionCatalog={permissionCatalog}
          onCancel={() => setMode("list")}
          onSubmit={async (values: UserFormInput) => {
            await createUser(values);
            setMode("list");
          }}
        />
      )}

      {/* Edit / View Modal */}
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

      {/* Reset Password Dialog */}
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
