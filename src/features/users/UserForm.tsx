import React, { useState } from "react";
import type { UserFormValues } from "../../types/user";

interface UserFormProps {
  onCancel: () => void;
  onConfirm: (values: UserFormValues) => void;
}

const emptyValues: UserFormValues = {
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

const UserForm: React.FC<UserFormProps> = ({ onCancel, onConfirm }) => {
  const [values, setValues] = useState<UserFormValues>(emptyValues);
  const [activeTab, setActiveTab] = useState<Tab>("user");

  const handleChange =
    (field: keyof UserFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = e.target as HTMLInputElement;
      const value = target.type === "checkbox" ? target.checked : target.value;

      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const handlePermissionChange =
    (perm: keyof UserFormValues["permissionInventory"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;

      setValues((prev) => {
        // กรณีกด All ให้ติ๊กทุกอัน / ปลดทุกอัน
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

        // ถ้า view/add/edit/delete ติ๊กครบ → all = true
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
                    type="password"
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.password}
                    onChange={handleChange("password")}
                  />
                  <button
                    type="button"
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
                <label className="block mb-1 text-xs font-medium">
                  Phone <span className="text-red-500">*</span>
                </label>
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
                    {/* สวิตช์เขียวแบบตัวอย่างที่ 2 */}
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
            //         <!--Default checkbox-->
            // {/* <div class="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
            //   <input
            //     class="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
            //     type="checkbox"
            //     value=""
            //     id="checkboxDefault" />
            //   <label
            //     class="inline-block ps-[0.15rem] hover:cursor-pointer"
            //     for="checkboxDefault">
            //     Default checkbox
            //   </label>
            // </div>

            // <!--Default checked checkbox-->
            // <div class="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
            //   <input
            //     class="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
            //     type="checkbox"
            //     value=""
            //     id="checkboxChecked"
            //     checked />
            //   <label
            //     class="inline-block ps-[0.15rem] hover:cursor-pointer"
            //     for="checkboxChecked">
            //     Checked checkbox
            //   </label>
            // </div> */}
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
