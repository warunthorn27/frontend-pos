import React, { useState, useMemo } from "react";
import type { UserFormInput, UserListItem } from "../../types/user";

interface UserFormProps {
  onCancel: () => void;
  onConfirm: (values: UserFormInput) => void;
  initialValues?: UserListItem;
}

const emptyValues: UserFormInput = {
  username: "",
  password: "",
  email: "",
  phone: "",
  status: "active",
  sendPasswordEmail: false,
  permissionInventory: {
    all: false,
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
};

type Tab = "user" | "permission";

const UserForm: React.FC<UserFormProps> = ({
  onCancel,
  onConfirm,
  initialValues,
}) => {
  const initialFormValues = useMemo(() => {
    if (initialValues) {
      // Convert UserListItem to UserFormInput for editing
      return {
        username: initialValues.name,
        password: "",
        email: initialValues.email,
        phone: initialValues.phone,
        status: initialValues.status,
        sendPasswordEmail: false,
        permissionInventory: {
          all: false,
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
      };
    }
    return emptyValues;
  }, [initialValues]);

  const [values, setValues] = useState<UserFormInput>(initialFormValues);
  const [activeTab, setActiveTab] = useState<Tab>("user");

  const handleChange =
    (field: keyof UserFormInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = e.target as HTMLInputElement;
      const value = target.type === "checkbox" ? target.checked : target.value;

      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const handlePermissionChange =
    (perm: keyof UserFormInput["permissionInventory"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;

      setValues((prev) => {
        if (perm === "all") {
          return {
            ...prev,
            permissionInventory: {
              all: checked,
              view: checked,
              add: checked,
              edit: checked,
              delete: checked,
            },
          };
        }

        const next = {
          ...prev.permissionInventory,
          [perm]: checked,
        };

        next.all = next.view && next.add && next.edit && next.delete;

        return {
          ...prev,
          permissionInventory: next,
        };
      });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(values);
  };

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let content = "";
    const pwLength = 10;

    for (let index = 0; index < pwLength; index++) {
      content += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setValues((prev) => ({ ...prev, password: content }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full">
        <div className="max-w-7xl mx-auto rounded-lg bg-[#F7F7F7] shadow-md px-16 py-12">
          {/* Tabs */}
          <div className="flex border-b border-gray-400 mb-8 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab("user")}
              className={`px-6 py-2 -mb-px border-b-2 ${
                activeTab === "user"
                  ? "border-blue-500 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("permission")}
              className={`px-6 py-2 -mb-px border-b-2 ${
                activeTab === "permission"
                  ? "border-blue-500 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Permission
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "user" && (
            <div className="max-w-md mx-auto space-y-4 text-sm text-gray-800">
              <h2 className="text-2xl font-medium text-center pt-3 pb-4 text-gray-900">
                User
              </h2>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                  value={values.username}
                  onChange={handleChange("username")}
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center gap-2">
                  <input
                    type="text"
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.password}
                    onChange={handleChange("password")}
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-4 py-2 rounded-md bg-[#0088FF] text-xs font-normal hover:bg-blue-500 text-white"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                  value={values.email}
                  onChange={handleChange("email")}
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium">Phone</label>
                <input
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                  value={values.phone}
                  onChange={handleChange("phone")}
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium">
                  Status <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={values.status === "active"}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          status: e.target.checked ? "active" : "inactive",
                        }))
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>

                  {/* ข้อความเปลี่ยนตามสถานะ */}
                  <span className="text-xs font-medium text-gray-800">
                    {values.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="sendPasswordEmail"
                  checked={values.sendPasswordEmail}
                  onChange={handleChange("sendPasswordEmail")}
                  className="mr-2 cursor-pointer"
                />
                <label
                  htmlFor="sendPasswordEmail"
                  className="text-xs
             font-medium cursor-pointer"
                >
                  Send password to email
                </label>
              </div>
            </div>
          )}

          {activeTab === "permission" && (
            <div className="text-sm text-gray-800">
              <h2 className="text-2xl mb-4 font-semibold">Permission</h2>

              <div className="overflow-x-auto">
                <table className="min-w-[1100px] text-xs border border-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Menu</th>
                      <th className="px-4 py-2 font-medium">All</th>
                      <th className="px-4 py-2 font-medium">View</th>
                      <th className="px-4 py-2 font-medium">Add</th>
                      <th className="px-4 py-2 font-medium">Edit</th>
                      <th className="px-4 py-2 font-medium">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b-7">
                      <td className="px-4 py-2">Inventory</td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={values.permissionInventory.all}
                          onChange={handlePermissionChange("all")}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          checked={values.permissionInventory.view}
                          onChange={handlePermissionChange("view")}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          checked={values.permissionInventory.add}
                          onChange={handlePermissionChange("add")}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          checked={values.permissionInventory.edit}
                          onChange={handlePermissionChange("edit")}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          checked={values.permissionInventory.delete}
                          onChange={handlePermissionChange("delete")}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Buttons ด้านล่าง (ใช้ร่วมกันทั้งสองแท็บ) */}
          <div className="mt-12 flex justify-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-7 py-2 rounded-md bg-[#FF383C] text-xs font-normal hover:bg-red-500 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2 rounded-md bg-[#34C759] text-xs font-normal hover:bg-[#2eb650] text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
