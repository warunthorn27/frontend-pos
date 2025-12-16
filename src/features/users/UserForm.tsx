import React, { useMemo, useState } from "react";
import type { UserFormInput, UserListItem } from "../../types/user";
import DropdownArrow2 from "../../assets/svg/dropdown-arrow2.svg?react";
import CheckboxDefault from "../../assets/svg/checkbox-default.svg?react";
import CheckboxVariant from "../../assets/svg/checkbox-variant.svg?react";
import StatusActive from "../../assets/svg/status-active.svg?react";
import StatusInactive from "../../assets/svg/status-inactive.svg?react";
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
    print: false,
    export: false,
  },
};

type Tab = "user" | "permission";

const DEFAULT_COUNTRY = "+66";

function digitsOnly(s: string) {
  return (s || "").replace(/\D/g, "");
}

// เก็บลง state/ส่ง API เป็น 0xxxxxxxxx
function normalizeThaiLocal0(input: string) {
  let d = digitsOnly(input);
  if (!d) return "";

  // ผู้ใช้พิมพ์ +66... หรือ 66... => แปลงเป็น 0...
  if (d.startsWith("66")) d = "0" + d.slice(2);

  // ผู้ใช้พิมพ์ 9 หลัก (ไม่ขึ้นต้น 0) => เติม 0
  if (!d.startsWith("0") && d.length === 9) d = "0" + d;

  // กันยาวเกิน (มือถือไทยทั่วไป 10 หลัก)
  return d.slice(0, 10);
}

const UserForm: React.FC<UserFormProps> = ({
  onCancel,
  onConfirm,
  initialValues,
}) => {
  const isEdit = !!initialValues;

  const initialFormValues = useMemo<UserFormInput>(() => {
    if (initialValues) {
      return {
        username: initialValues.name,
        password: "", // จะมีค่าเฉพาะตอนกด Generate เท่านั้น
        email: initialValues.email,
        phone: initialValues.phone || "",
        status: initialValues.status,
        sendPasswordEmail: false,
        permissionInventory: {
          all: false,
          view: false,
          add: false,
          edit: false,
          delete: false,
          print: false,
          export: false,
        },
      };
    }
    return emptyValues;
  }, [initialValues]);

  const [values, setValues] = useState<UserFormInput>(initialFormValues);
  const [activeTab, setActiveTab] = useState<Tab>("user");
  const [passwordGenerated, setPasswordGenerated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasEmail = values.email.trim().length > 0;

  // disable แค่ตอนไม่มี email
  const canSendPasswordEmail = hasEmail;

  const setField = <K extends keyof UserFormInput>(
    key: K,
    value: UserFormInput[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField("username", e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValues((prev) => {
      const next: UserFormInput = { ...prev, email: v };
      // ถ้า email ถูกลบ -> ปิด sendPasswordEmail อัตโนมัติ
      if (!v.trim()) next.sendPasswordEmail = false;
      return next;
    });
  };

  const handleSendEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField("sendPasswordEmail", e.target.checked);
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
              print: checked,
              export: checked,
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

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let content = "";
    const pwLength = 8;

    for (let i = 0; i < pwLength; i++) {
      content += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setField("password", content);
    setPasswordGenerated(true);

    // ถ้ามี email อยู่แล้ว ให้ user เลือกส่งได้ทันที (ไม่ auto-check)
    // ถ้าอยาก auto-check ให้ทำ setField("sendPasswordEmail", true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // create ต้อง generate ก่อน
    if (!isEdit && !values.password) {
      alert("Please generate password before confirm.");
      setIsSubmitting(false);
      return;
    }

    // ถ้าติ๊กส่งเมล แต่ยังไม่มี password ใหม่ให้ส่ง
    if (values.sendPasswordEmail && !values.password) {
      alert("Please generate password before sending email.");
      setIsSubmitting(false);
      return;
    }

    onConfirm(values);
    setIsSubmitting(false);
  };

  const passwordDisplayValue = passwordGenerated
    ? values.password
    : isEdit
    ? "********"
    : "";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full">
        <div className="w-[1630px] h-[843px] rounded-lg bg-[#FAFAFA] shadow-md px-14 py-5">
          {/* <div className="max-w-7xl mx-auto rounded-lg bg-[#FAFAFA] shadow-md px-14 py-5"> */}

          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-[88px] text-2xl font-regular">
            <button
              type="button"
              onClick={() => setActiveTab("user")}
              className={`w-[200px] py-2 border-b-4 ${
                activeTab === "user"
                  ? "border-[#004E92] text-[#024C8A]"
                  : "border-transparent text-black hover:text-[#024C8A]"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("permission")}
              className={`w-[200px] py-2 border-b-4 ${
                activeTab === "permission"
                  ? "border-[#004E92] text-[#024C8A]"
                  : "border-transparent text-black hover:text-[#024C8A]"
              }`}
            >
              Permission
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "user" && (
            <div className="max-w-md  mx-auto space-y-6 text-black">
              <h2 className="text-[32px] font-regular text-center text-black">
                User
              </h2>

              <div>
                <label className="block mb-1 text-base font-regular">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-[479px] h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                  value={values.username}
                  onChange={handleUsernameChange}
                />
              </div>

              {/* Password (disable input) */}
              <div>
                <label className="block mb-1 text-base font-regular">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="w-[479px] h-[38px] flex justify-center gap-2">
                  <input
                    type="text"
                    disabled
                    readOnly
                    className="w-[350px] h-[38px] rounded-md border border-[#CFCFCF] px-3 text-sm outline-none text-black cursor-not-allowed"
                    value={passwordDisplayValue}
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="w-[119px] h-[38px] rounded-md bg-[#0088FF] text-base font-regular hover:bg-[#0574D6] text-white"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-base font-regular">
                  Email
                </label>
                <input
                  type="email"
                  className="w-[479px] h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                  value={values.email}
                  onChange={handleEmailChange}
                />
              </div>

              {/* Phone (+66) */}
              <div>
                <label className="block mb-1 text-base font-regular">
                  Phone
                </label>

                <div className="flex w-[479px] h-[38px]">
                  <div className="w-[70px] h-[38px] flex items-center gap-2 rounded-l-md border border-[#CFCFCF] bg-white px-3 text-sm text-[#545454]">
                    <span className="select-none">{DEFAULT_COUNTRY}</span>
                    <DropdownArrow2 color="[#545454]" width="10" height="5" />
                  </div>

                  <input
                    inputMode="numeric"
                    className="w-[479px] h-[38px] rounded-r-md border border-l-0 border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                    value={values.phone}
                    onChange={(e) =>
                      setField("phone", normalizeThaiLocal0(e.target.value))
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block mb-[5px] text-base font-regular">
                  Status <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "status",
                        values.status === "active" ? "inactive" : "active"
                      )
                    }
                    className="inline-flex items-center"
                    aria-pressed={values.status === "active"}
                    aria-label="Toggle status"
                  >
                    {values.status === "active" ? (
                      <StatusActive className="w-[60px] h-[30px]" />
                    ) : (
                      <StatusInactive className="w-[60px] h-[30px]" />
                    )}
                  </button>

                  <span className="text-sm font-regular text-gray-800">
                    {values.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Send password to email */}
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="sendPasswordEmail"
                  checked={values.sendPasswordEmail}
                  disabled={!canSendPasswordEmail}
                  onChange={handleSendEmailChange}
                  className="sr-only"
                />

                <label
                  htmlFor="sendPasswordEmail"
                  className={`flex items-center gap-3 select-none ${
                    canSendPasswordEmail
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-60"
                  }`}
                >
                  {values.sendPasswordEmail ? (
                    <CheckboxVariant className="w-[25px] h-[25px]" />
                  ) : (
                    <CheckboxDefault className="w-[25px] h-[25px]" />
                  )}

                  <span className="text-sm font-regular">
                    Send Infomation to email
                  </span>
                </label>
              </div>

              {!hasEmail && (
                <p className="text-xs text-gray-500">
                  Please enter your email to send the password.
                </p>
              )}

              {hasEmail && isEdit && !passwordGenerated && (
                <p className="text-xs text-gray-500">
                  Please click "Generate" first to enable sending the password
                  via email.
                </p>
              )}
            </div>
          )}

          {/* Permission tab (เดิม) */}
          {activeTab === "permission" && (
            <div className=" text-gray-800">
              <h2 className="text-3xl mb-[30px] mt-[60px] font-medium text-center">
                Permission
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-[1100px] text-sm border border-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-regular">Menu</th>
                      <th className="px-4 py-2 font-regular">All</th>
                      <th className="px-4 py-2 font-regular">View</th>
                      <th className="px-4 py-2 font-regular">Add</th>
                      <th className="px-4 py-2 font-regular">Edit</th>
                      <th className="px-4 py-2 font-regular">Delete</th>
                      <th className="px-4 py-2 font-regular">Print</th>
                      <th className="px-4 py-2 font-regular">Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
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
                      <td className="px-4 py-2 text-center">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          checked={values.permissionInventory.print}
                          onChange={handlePermissionChange("print")}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          checked={values.permissionInventory.export}
                          onChange={handlePermissionChange("export")}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-[23px] flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-[99px] h-[37px] px-5 py-[5px] rounded-md bg-[#FF383C] text-lg font-regular hover:bg-[#E71010] text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[99px] h-[37px] px-5 py-[5px] rounded-md bg-[#34C759] text-lg font-regular hover:bg-[#24913F] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
