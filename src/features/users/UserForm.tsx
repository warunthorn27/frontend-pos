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
import Checkbox from "../../component/ui/Checkbox";
import {
  formatPhoneForDisplay,
  normalizePhoneForApi,
  isValidPhone,
} from "../../utils/phone";
import ToggleSwitch from "../../component/ui/ToggleSwitch";
import ReadonlyField from "../../component/ui/ReadonlyField";

type LabelProps = {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
};

export function Label({ children, required, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-base font-normal text-black mb-2"
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

type InputProps = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
};

export function Input({
  value,
  onChange,
  disabled,
  readOnly,
  placeholder,
}: InputProps) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || readOnly}
      className={`
        w-full h-[38px] rounded-md border px-3 text-sm
        ${disabled || readOnly ? "bg-white text-black" : "bg-white"}
        focus:outline-none focus:ring-1 focus:ring-[#3B82F6]
      `}
    />
  );
}

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

export function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

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

  /* ---------- state ---------- */

  const [username, setUsername] = useState(initialValues?.username ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [phone, setPhone] = useState(
    initialValues?.phone ? formatPhoneForDisplay(initialValues.phone) : "",
  );
  const [active, setActive] = useState(initialValues?.active ?? true);
  const [password, setPassword] = useState("");
  const [passwordGenerated, setPasswordGenerated] = useState(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  /* ---------- password generator ---------- */

  function createRandomPassword(length = 8): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  const generatePassword = (): void => {
    const newPassword = createRandomPassword(8);

    setPassword(newPassword);
    setPasswordGenerated(true);
    markAsChanged();
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

  const isDisabled = !email.trim() || !active; // inactive → disable
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
    markAsChanged();
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
    isSubmitting ||
    !hasChanges ||
    (isCreate && !isValidRequired) ||
    Boolean(phoneError);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const markAsChanged = (): void => {
    setHasChanges(true);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col flex-1 min-h-0">
        {!isView && !isEdit && (
          <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
            User & Permission
          </h2>
        )}

        <div className="flex-1 min-h-0 rounded-lg bg-[#FAFAFA] shadow flex flex-col overflow-hidden">
          <form
            id="user-form"
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="flex flex-col h-full min-h-0"
          >
            <div className="flex-1 px-10 py-6 min-h-0 flex flex-col">
              {/* Status */}
              <div className="flex items-center gap-3 mb-6">
                <ToggleSwitch
                  checked={active}
                  disabled={isView}
                  onChange={(checked) => {
                    setActive(checked);
                    markAsChanged();
                  }}
                />
                <span className="text-sm">
                  {active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-6 mb-6 max-w-[1000px]">
                <div>
                  <FormField label="Username" required>
                    {isView ? (
                      <ReadonlyField value={username} />
                    ) : (
                      <Input
                        value={username}
                        onChange={(v) => {
                          setUsername(v);
                          markAsChanged();
                        }}
                      />
                    )}
                  </FormField>
                </div>

                <div>
                  <FormField
                    label={isCreate ? "Password" : "Generate Password"}
                    required
                  >
                    {isView ? (
                      <ReadonlyField value="*******" />
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={
                            isCreate
                              ? password
                              : passwordGenerated
                                ? password
                                : "*******"
                          }
                          onChange={setPassword}
                          readOnly
                        />

                        <button
                          type="button"
                          onClick={generatePassword}
                          className="h-[38px] px-5 rounded-md text-white bg-[#0088FF] hover:bg-[#0574D6]"
                        >
                          Generate
                        </button>
                      </div>
                    )}
                  </FormField>
                </div>

                <div>
                  <FormField label="Email">
                    {isView ? (
                      <ReadonlyField value={email} />
                    ) : (
                      <Input
                        value={email}
                        onChange={(v) => {
                          setEmail(v);
                          markAsChanged();
                        }}
                      />
                    )}
                  </FormField>
                </div>

                <div>
                  <FormField label="Phone">
                    {isView ? (
                      <ReadonlyField value={phone} />
                    ) : (
                      <>
                        <Input
                          value={phone}
                          onChange={(v) => {
                            setPhone(v);
                            markAsChanged();
                          }}
                        />
                        {phoneError && (
                          <div className="text-xs text-red-500 mt-1">
                            {phoneError}
                          </div>
                        )}
                      </>
                    )}
                  </FormField>
                </div>
              </div>

              {!isView && (
                <label className="flex items-center mb-10 gap-4 text-sm">
                  <Checkbox
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={setSendPasswordEmail}
                  />
                  <span className={isDisabled ? "text-gray-400" : ""}>
                    Send information to email.
                  </span>
                </label>
              )}

              <div className="w-full h-full flex flex-col min-h-0">
                <PermissionTable
                  menus={menus}
                  disabled={isView}
                  checksByMenu={permissions}
                  onToggle={handleTogglePermission}
                  mode={mode}
                />
              </div>
            </div>

            {!isView && (
              <div className="sticky bottom-0 z-10 bg-[#FAFAFA] py-4 border-t border-[#E6E6E6] flex justify-center gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-24 px-4 py-[6px] rounded-md bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={disableSave}
                  className={`w-24 px-4 py-[6px] rounded-md text-base font-normal
                  ${
                    disableSave
                      ? "bg-[#CFCFCF] text-white cursor-not-allowed"
                      : "bg-[#005AA7] hover:bg-[#084072] text-white"
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
    </div>
  );
};

export default UserForm;
