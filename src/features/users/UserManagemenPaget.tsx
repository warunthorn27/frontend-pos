import React, { useState } from "react";
import UserList from "./UserList";
import UserForm from "./UserForm";
import useUsers from "../../hooks/useUsers";
import type { UserFormInput, UserListItem } from "../../types/user";
import type { AuthUser } from "../../types/auth";

interface UserManagementPageProps {
  currentUser: AuthUser;
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({
  currentUser,
}) => {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);

  const { users, createUser, updateUser, resetPassword, toggleStatus } =
    useUsers();

  const handleCreateClick = () => {
    if (currentUser.role !== "Admin") {
      alert("Only admin users can create new users");
      return;
    }

    const activeUsers = users.filter((u) => u.status === "active").length;
    if (activeUsers >= 3) {
      alert("Maximum 3 active users allowed for admin account");
      return;
    }
    setMode("create");
  };

  const handleCancel = () => {
    setMode("list");
    setEditingUser(null);
  };

  const handleConfirm = async (values: UserFormInput) => {
    try {
      if (mode === "edit" && editingUser) {
        await updateUser(editingUser.id, values);
      } else {
        await createUser(values);
      }
      setMode("list");
      setEditingUser(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <>
      {mode === "list" && (
        <UserList
          users={users}
          onCreateUser={handleCreateClick}
          onEditUser={(u) => {
            if (currentUser.role !== "Admin") {
              alert("Only admin users can edit users");
              return;
            }
            setEditingUser(u);
            setMode("edit");
          }}
          onResetPassword={async (u) => {
            if (currentUser.role !== "Admin") {
              alert("Only admin users can reset passwords");
              return;
            }

            const newPass = prompt("Enter new password");
            if (!newPass) return;

            try {
              await resetPassword(u.id, newPass);
              alert("Password reset!");
            } catch (error) {
              alert(
                error instanceof Error ? error.message : "An error occurred"
              );
            }
          }}
          onToggleStatus={async (u, isActive) => {
            if (currentUser.role !== "Admin") {
              alert("Only admin users can change user status");
              return;
            }

            try {
              await toggleStatus(u.id, isActive);
            } catch (error) {
              alert(
                error instanceof Error ? error.message : "An error occurred"
              );
            }
          }}
          maxUsers={3}
        />
      )}

      {(mode === "create" || mode === "edit") && (
        <UserForm
          key={mode === "edit" ? `edit-${editingUser?.id}` : "create"}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          initialValues={
            mode === "edit" && editingUser ? editingUser : undefined
          }
        />
      )}
    </>
  );
};

export default UserManagementPage;
