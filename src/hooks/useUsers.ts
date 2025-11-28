import { useState, useEffect, useCallback } from "react";
import type { UserFormInput, UserListItem, UserModel } from "../types/user";

const API_BASE = "http://localhost:3000/api";

export default function useUsers() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const comp_id = localStorage.getItem("comp_id");

  console.log('Token:', token ? 'present' : 'missing');
  console.log('Comp_id:', comp_id);

  // ----------------------------
  // LOAD USERS
  // ----------------------------
  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      console.log('Loading users for comp_id:', comp_id);
      const res = await fetch(`${API_BASE}/user?comp_id=${comp_id}`, {
        headers: { authtoken: token! },
      });

      console.log('API response status:', res.status);
      const json = await res.json();
      console.log('API response:', json);

      if (json.success) {
        const mapped: UserListItem[] = json.data.map((u: UserModel) => ({
          id: u._id,
          name: u.user_name,
          email: u.user_email,
          phone: u.user_phone,
          status: u.status ? "active" : "inactive",
        }));

        console.log('Mapped users:', mapped);
        setUsers(mapped);
      } else {
        console.error('API returned success: false', json);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }

    setLoading(false);
  }, [token, comp_id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  // ----------------------------
  // CREATE USER
  // ----------------------------
  const createUser = async (values: UserFormInput) => {
    console.log('Creating user with data:', values);
    const body = {
      user_name: values.username,
      user_password: values.password,
      user_email: values.email,
      user_phone: values.phone,
      user_role: "User",
      comp_id,
      permissions: [],
    };

    console.log('Create user request body:', body);
    const res = await fetch(`${API_BASE}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authtoken: token!,
      },
      body: JSON.stringify(body),
    });

    console.log('Create user response status:', res.status);
    const json = await res.json();
    console.log('Create user response:', json);

    if (json.success) {
      await loadUsers();
    } else {
      throw new Error(json.error || json.message);
    }
  };

  // ----------------------------
  // RESET PASSWORD
  // ----------------------------
  const resetPassword = async (userId: string, newPass: string) => {
    const res = await fetch(`${API_BASE}/resetpass-user-byadmin/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authtoken: token!,
      },
      body: JSON.stringify({ user_password: newPass }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message);
  };

  // ----------------------------
  // UPDATE USER
  // ----------------------------
  const updateUser = async (userId: string, values: UserFormInput) => {
    const body = {
      user_name: values.username,
      user_email: values.email,
      user_phone: values.phone,
      user_role: "User",
      permissions: [], // TODO: handle permissions
    };

    const res = await fetch(`${API_BASE}/update-user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authtoken: token!,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (json.success) {
      await loadUsers();
    } else {
      throw new Error(json.error || json.message);
    }
  };

  // ----------------------------
  // CHANGE STATUS
  // ----------------------------
  const toggleStatus = async (userId: string, isActive: boolean) => {
    const res = await fetch(`${API_BASE}/changestatus-user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authtoken: token!,
      },
      body: JSON.stringify({ status: isActive }),
    });

    const json = await res.json();
    if (json.success) {
      loadUsers();
    } else {
      throw new Error(json.message);
    }
  };

  return {
    users,
    loading,
    loadUsers,
    createUser,
    updateUser,
    resetPassword,
    toggleStatus,
  };
}
