import React, { useState } from "react";
import UserList from "./UserList";
import type { UserRow, UserFormValues } from "../../types/user";
import UserForm from "./UserForm";

type Mode = "list" | "create";

const UserManagementPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>("list");
  const [users, setUsers] = useState<UserRow[]>([]);

  const handleCreateClick = () => {
    setMode("create");
  };

  const handleCancel = () => {
    setMode("list");
  };

  const handleConfirm = (values: UserFormValues) => {
    const newUser: UserRow = {
      id: Date.now(),
      name: values.username || "(no name)",
      email: values.email,
      phone: values.phone,
      status: values.status,
    };

    setUsers((prev) => [...prev, newUser]);
    setMode("list");
  };

  if (mode === "list") {
    return <UserList users={users} onCreateUser={handleCreateClick} />;
  }

  return <UserForm onCancel={handleCancel} onConfirm={handleConfirm} />;
};

export default UserManagementPage;
