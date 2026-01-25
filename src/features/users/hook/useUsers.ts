import { useState, useEffect, useCallback } from "react";
import type { UserFormInput, UserListItem } from "../../../types/user";
import {
  fetchUsers,
  fetchUserById as apiFetchUserById,
  createUser as apiCreateUser,
  updateUserByAdmin as apiUpdateUserByAdmin,
  resetPasswordByAdmin as apiResetPasswordByAdmin,
  changeUserStatus as apiChangeUserStatus,
} from "../../../services/user";
import type {
  PermissionCatalog,
  PermissionDTO,
} from "../../../types/permission";
import { fetchPermissions } from "../../../services/permission";
import { buildCatalog } from "../../../utils/permission";

export default function useUsers() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionList, setPermissionList] = useState<PermissionDTO[]>([]);
  const [permissionCatalog, setPermissionCatalog] = useState<PermissionCatalog>(
    {},
  );
  const [permissionMenus, setPermissionMenus] = useState<string[]>([]);

  /* load users */
  const loadUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(
        data.map((u) => ({
          ...u,
          password: "*****",
        })),
      );
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* permissions */
  useEffect(() => {
    fetchPermissions().then((list) => {
      setPermissionList(list);
      const catalog = buildCatalog(list);
      setPermissionCatalog(catalog);
      setPermissionMenus(Object.keys(catalog));
    });
  }, []);

  /* get user by id*/
  const getUserById = async (userId: string): Promise<UserListItem> => {
    const u = await apiFetchUserById(userId);

    const normalized: UserListItem = {
      ...u,
      password: "*****",
    };

    setUsers((prev) => prev.map((x) => (x.id === userId ? normalized : x)));

    return normalized;
  };

  /* create user */
  const createUser = async (values: UserFormInput): Promise<UserListItem> => {
    /**
     * values.password = plain text (จาก generate)
     */
    const created = await apiCreateUser(values);

    const normalized: UserListItem = {
      ...created,
      password: "*****",
    };

    setUsers((prev) => [normalized, ...prev]);
    return normalized;
  };

  /* update user */
  const updateUser = async (
    userId: string,
    values: UserFormInput,
  ): Promise<UserListItem> => {
    const updated = await apiUpdateUserByAdmin(userId, values);

    const normalized: UserListItem = {
      ...updated,
      password: "*****",
    };

    setUsers((prev) => prev.map((u) => (u.id === userId ? normalized : u)));

    return normalized;
  };

  /* reset password */
  const resetPassword = async (
    userId: string,
    newPassword: string,
    sendEmail: boolean,
  ): Promise<string> => {
    const result = await apiResetPasswordByAdmin(
      userId,
      newPassword,
      sendEmail,
    );

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: "*****" } : u)),
    );

    return result.message;
  };

  /* change status */
  const toggleStatus = async (
    userId: string,
    isActive: boolean,
  ): Promise<UserListItem> => {
    const updated = await apiChangeUserStatus(userId, isActive);

    const normalized: UserListItem = {
      ...updated,
      password: "*****",
    };

    setUsers((prev) => prev.map((u) => (u.id === userId ? normalized : u)));

    return normalized;
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    getUserById,
    createUser,
    updateUser,
    resetPassword,
    toggleStatus,
    permissionList,
    permissionCatalog,
    permissionMenus,
  };
}
