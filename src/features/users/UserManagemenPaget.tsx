// src/features/users/UserManagementPage.tsx
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import UserList from "./UserList";
import UserForm from "./UserForm";
import ResetPasswordDialog from "./ResetPasswordDialog";
import useUsers from "./hooks/useUsers";
import type { UserFormInput, UserListItem } from "../../types/user";
import type { DashboardOutletContext } from "../../layouts/DashboardLayout";

const UserManagementPage: React.FC = () => {
  const { currentUser } = useOutletContext<DashboardOutletContext>();

  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);

  // reset password dialog
  const [resetOpen, setResetOpen] = useState(false);
  const [resetUser, setResetUser] = useState<UserListItem | null>(null);

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
        const userId = editingUser.id; // ✅ ล็อกไว้ก่อนกัน state เพี้ยน

        await updateUser(userId, values);

        // ถ้ามีการ generate password ใหม่ในหน้า edit ถึงจะ reset
        if (values.password) {
          await resetPassword(
            userId,
            values.password,
            values.sendPasswordEmail
          );
        }
      } else {
        await createUser(values);
      }

      setMode("list");
      setEditingUser(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const openResetDialog = (u: UserListItem) => {
    if (currentUser.role !== "Admin") {
      alert("Only admin users can reset passwords");
      return;
    }
    setResetUser(u);
    setResetOpen(true);
  };

  const closeResetDialog = () => {
    setResetOpen(false);
    setResetUser(null);
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
          onResetPassword={openResetDialog}
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

      {/* Reset Password Dialog (2 steps: confirm -> success + send email) */}
      <ResetPasswordDialog
        open={resetOpen}
        user={resetUser}
        onClose={closeResetDialog}
        onResetPassword={resetPassword}
      />
    </>
  );
};

export default UserManagementPage;
