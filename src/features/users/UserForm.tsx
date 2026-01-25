import React, { useState } from "react";
import PermissionTable from "./PermissionTable";
import type {
  PermissionChecksByMenu,
  PermissionAction,
  PermissionChecks,
  PermissionCatalog,
} from "../../types/permission";
import { defaultChecks, toSelectedPermissionIds } from "../../utils/permission";
import type { UserFormInput } from "../../types/user";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import {
  formatPhoneForDisplay,
  normalizePhoneForApi,
  isValidPhone,
} from "../../utils/phone";
import ToggleSwitch from "../../component/ui/ToggleSwitch";

type Props = {
  initialValues?: {
    username: string;
    email?: string;
    phone?: string;
    active: boolean;
    permissions: PermissionChecksByMenu;
  };
  menus?: string[];
  permissionCatalog: PermissionCatalog;
  onSubmit: (data: UserFormInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode?: "view" | "edit" | "create";
};

const UserForm: React.FC<Props> = ({
  initialValues,
  menus = [],
  permissionCatalog,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = "edit",
}) => {
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isCreate = mode === "create";

  const inputBaseClass =
    "w-[470px] h-[38px] border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500";

  /* ---------- state ---------- */

  const [username, setUsername] = useState(initialValues?.username ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [phone, setPhone] = useState(
    initialValues?.phone ? formatPhoneForDisplay(initialValues.phone) : "",
  );
  const [active, setActive] = useState(initialValues?.active ?? true);
  const [password, setPassword] = useState("");
  const [passwordGenerated, setPasswordGenerated] = useState(false);

  /* ---------- password generator ---------- */

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setPasswordGenerated(true);
  };

  /* ---------- permissions ---------- */

  const [permissions, setPermissions] = useState<PermissionChecksByMenu>(() => {
    if (initialValues?.permissions) return initialValues.permissions;
    const init: PermissionChecksByMenu = {};
    menus.forEach((m) => (init[m] = defaultChecks()));
    return init;
  });

  const [sendPasswordEmail, setSendPasswordEmail] = useState(false);

  /* ---------- checkbox ---------- */

  const isDisabled = !email.trim();
  const isChecked = sendPasswordEmail && !isDisabled;

  const handleTogglePermission = (
    menu: string,
    action: "all" | PermissionAction,
    checked: boolean,
  ) => {
    setPermissions((prev) => {
      const current: PermissionChecks = prev[menu] ?? defaultChecks();

      if (action === "all") {
        return {
          ...prev,
          [menu]: {
            all: checked,
            view: checked,
            add: checked,
            update: checked,
            delete: checked,
            print: checked,
            export: checked,
          },
        };
      }

      const next = { ...current, [action]: checked };
      next.all =
        next.view &&
        next.add &&
        next.update &&
        next.delete &&
        next.print &&
        next.export;

      return { ...prev, [menu]: next };
    });
  };

  /* ---------- validation ---------- */

  const phoneError =
    phone && !isValidPhone(phone)
      ? "Phone must be Thai format (0xxxxxxxxx)"
      : "";

  const isValidRequired =
    username.trim().length > 0 &&
    (isCreate ? password.trim().length > 0 : true);

  const disableSave =
    isSubmitting || (isCreate && !isValidRequired) || Boolean(phoneError);

  /* ---------- submit ---------- */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disableSave) return;

    const permissionIds = toSelectedPermissionIds(
      permissions,
      permissionCatalog,
    );

    const payload: UserFormInput = {
      username: username.trim(),
      email: email.trim() || undefined,
      phone: phone ? normalizePhoneForApi(phone) : undefined,
      status: active ? "active" : "inactive",
      permissions: permissionIds,
    };

    // CREATE MODE
    if (isCreate) {
      if (!password.trim()) {
        alert("Please generate password before saving");
        return;
      }

      payload.password = password;
      payload.sendPasswordEmail = Boolean(email.trim() && sendPasswordEmail);
    }

    // EDIT MODE (เฉพาะกรณี generate password ใหม่)
    if (isEdit && passwordGenerated) {
      payload.password = password;
      payload.sendPasswordEmail = Boolean(email.trim() && sendPasswordEmail);
    }

    onSubmit(payload);
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-[1600px] mx-auto h-full flex flex-col min-h-0">
        {!isView && !isEdit && (
          <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
            User & Permission
          </h2>
        )}

        <form id="user-form" onSubmit={handleSubmit}>
          <div className="bg-[#FAFAFA] rounded-lg shadow px-8 py-8 flex-1 overflow-y-auto">
            {/* Status */}
            <div className="flex items-center gap-3 mb-6">
              <ToggleSwitch
                checked={active}
                disabled={isView}
                onChange={(checked) => setActive(checked)}
              />
              <span className="text-sm">{active ? "Active" : "Inactive"}</span>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-6 mb-6 max-w-[1000px]">
              <div>
                <label>Username *</label>
                <input
                  className={inputBaseClass}
                  value={username}
                  disabled={isView}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>{isCreate ? "Password *" : "Generate Password"}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      isCreate
                        ? password
                        : passwordGenerated
                          ? password
                          : "*******"
                    }
                    className={`w-[350px] h-[38px] border rounded-md px-3 text-sm
                      ${isView ? "bg-gray-100 text-gray-400" : "bg-white text-black"}
                      `}
                  />

                  <button
                    type="button"
                    disabled={isView}
                    onClick={generatePassword}
                    className={`h-[38px] px-5 rounded-md text-white transition
                      ${
                        isView
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#0088FF] hover:bg-[#0574D6]"
                      }
                    `}
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label>Email</label>
                <input
                  className={inputBaseClass}
                  disabled={isView}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  className={inputBaseClass}
                  disabled={isView}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {phoneError && (
                  <div className="text-xs text-red-500 mt-1">{phoneError}</div>
                )}
              </div>
            </div>

            <label className="flex items-center gap-3 mb-10 text-sm">
              <Checkbox
                checked={isChecked}
                disabled={isDisabled || isView}
                onChange={(e) => setSendPasswordEmail(e.target.checked)}
                icon={<CheckBoxOutlineBlankRoundedIcon />}
                checkedIcon={<CheckBoxRoundedIcon />}
              />
              <span className={isDisabled ? "text-gray-400" : ""}>
                Send information to email.
              </span>
            </label>

            <PermissionTable
              menus={menus}
              disabled={isView}
              checksByMenu={permissions}
              onToggle={handleTogglePermission}
            />
          </div>

          {!isView && (
            <div className="py-4 border-t border-[#E6E6E6] flex justify-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-7 py-2 rounded-md bg-[#FF383C] text-[13px] font-normal hover:bg-[#E71010] text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={disableSave}
                className={`px-8 py-2 rounded-md text-[13px] font-normal text-white
                  ${
                    disableSave
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#34C759] hover:bg-[#24913F]"
                  }
                `}
              >
                Save
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserForm;
