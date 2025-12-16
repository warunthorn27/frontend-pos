import { useState, useEffect, useCallback } from "react";
import type { UserFormInput, UserListItem } from "../../../types/user";
import {
  fetchUsers,
  createUser as apiCreateUser,
  updateUserByAdmin,
  resetPasswordByAdmin,
  changeUserStatus,
} from "../../../services/user";

export default function useUsers() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const createUser = async (values: UserFormInput): Promise<UserListItem> => {
    const created = await apiCreateUser(values);
    setUsers((prev) => [created, ...prev]);
    return created;
  };

  const updateUser = async (
    userId: string,
    values: UserFormInput
  ): Promise<UserListItem> => {
    const updated = await updateUserByAdmin(userId, values);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    return updated;
  };

  const resetPassword = async (
    userId: string,
    newPass: string,
    sendEmail: boolean
  ): Promise<string> => {
    // typed จาก service อยู่แล้ว: Promise<{ message: string }>
    const result = await resetPasswordByAdmin(userId, newPass, sendEmail);
    return result.message;
  };

  const toggleStatus = async (
    userId: string,
    isActive: boolean
  ): Promise<UserListItem> => {
    const updated = await changeUserStatus(userId, isActive);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    return updated;
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    resetPassword,
    toggleStatus,
  };
}
