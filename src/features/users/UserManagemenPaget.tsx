import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import UserForm from "./UserForm";
import ResetPasswordDialog from "./ResetPasswordDialog";
import useUsers from "./hook/useUsers";
import type { UserFormInput, UserListItem } from "../../types/user";
import { buildChecksByMenu } from "../../utils/permission";
import CloseModal from "../../assets/svg/close.svg?react";

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
      {editOpen && editingUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
          <div className="w-[1200px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6">
            {/* HEADER + EDIT BUTTON */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-normal text-[#06284B]">
                User & Permission
              </h2>

              <div className="flex items-center gap-2">
                {formMode === "view" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFormMode("edit")}
                      className="px-4 py-2 bg-[#0088FF] text-white rounded-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setEditOpen(false);
                        setEditingUser(null);
                        setFormMode("view");
                      }}
                      className="w-9 h-9 flex items-center justify-center text-gray-600"
                      aria-label="Close modal"
                    >
                      <CloseModal className="w-12 h-12" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <UserForm
              mode={formMode}
              menus={permissionMenus}
              permissionCatalog={permissionCatalog}
              initialValues={{
                username: editingUser.name,
                email: editingUser.email,
                phone: editingUser.phone,
                active: editingUser.status === "active",
                permissions: buildChecksByMenu(permissionMenus),
              }}
              onCancel={() => {
                setEditOpen(false);
                setEditingUser(null);
              }}
              onSubmit={async (values) => {
                await updateUser(editingUser.id, values);
                if (values.password?.trim()) {
                  await resetPassword(
                    editingUser.id,
                    values.password,
                    values.sendPasswordEmail ?? false,
                  );
                }
                setEditOpen(false);
                setEditingUser(null);
              }}
            />
          </div>
        </div>
      )}

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
