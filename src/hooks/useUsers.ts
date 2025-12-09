import { useState, useEffect, useCallback } from "react";
import type { UserFormInput, UserListItem } from "../types/user";
import {
  fetchUsers,
  createUser as apiCreateUser,
  updateUserByAdmin,
  resetPasswordByAdmin,
  changeUserStatus,
} from "../services/user";

export default function useUsers() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
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
    loadUsers();
  }, [loadUsers]);

  const createUser = async (values: UserFormInput) => {
    await apiCreateUser(values);
    await loadUsers();
  };

  const updateUser = async (userId: string, values: UserFormInput) => {
    await updateUserByAdmin(userId, values);
    await loadUsers();
  };

  const resetPassword = async (userId: string, newPass: string) => {
    await resetPasswordByAdmin(userId, newPass);
    // ไม่ต้อง reload user ทั้ง list ก็ได้ เพราะเราไม่ได้โชว์ password อยู่แล้ว
  };

  const toggleStatus = async (userId: string, isActive: boolean) => {
    await changeUserStatus(userId, isActive);
    await loadUsers();
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
