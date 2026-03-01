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
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  /* load users */
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchUsers(page, pageSize);

      setUsers(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
    const created = await apiCreateUser(values);

    await loadUsers();
    return created;
  };

  /* update user */
  const updateUser = async (
    userId: string,
    values: UserFormInput,
  ): Promise<UserListItem> => {
    const updated = await apiUpdateUserByAdmin(userId, values);

    await loadUsers();
    return updated;
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

    return result.message;
  };

  /* change status */
  const toggleStatus = async (
    userId: string,
    isActive: boolean,
  ): Promise<UserListItem> => {
    const updated = await apiChangeUserStatus(userId, isActive);

    await loadUsers();
    return updated;
  };

  return {
    users,
    loading,
    error,
    page,
    pageSize,
    total,
    totalPages,
    setPage,
    setPageSize,
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
