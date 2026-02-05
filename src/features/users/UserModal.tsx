import React from "react";
import RemoveIcon from "../../assets/svg/remove.svg?react";
import EditIcon from "../../assets/svg/edit.svg?react";
import UserForm from "./UserForm";
import type { UserFormInput, UserListItem } from "../../types/user";
import { buildChecksByMenu } from "../../utils/permission";
import type { PermissionCatalog } from "../../types/permission";
import Modal from "@mui/material/Modal";

type Props = {
  open: boolean;
  user: UserListItem;
  mode: "view" | "edit";
  menus: string[];
  permissionCatalog: PermissionCatalog;
  onClose: () => void;
  onEdit: () => void;
  onSubmit: (data: UserFormInput) => Promise<void>;
};

const UserModal: React.FC<Props> = ({
  open,
  user,
  mode,
  menus,
  permissionCatalog,
  onClose,
  onEdit,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30">
        <div
          className="w-full max-w-[min(1200px,95vw)] max-h-[90vh] h-full bg-white rounded-t-lg shadow-lg 
          grid grid-rows-[auto_1fr_auto]"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-3 border-b">
            <h2 className="text-xl font-normal text-[#06284B]">
              User & Permission
            </h2>

            <div className="flex items-center gap-3">
              {mode === "view" && (
                <button
                  className="px-3 py-1.5 text-base text-black bg-white border border-[#CFCFCF] 
                  hover:bg-[#F1F1F1] rounded-md flex items-center gap-2"
                  onClick={onEdit}
                >
                  <EditIcon className="w-5 h-5" />
                  Edit
                </button>
              )}

              <button onClick={onClose}>
                <RemoveIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BODY  */}
          <div className="flex flex-1 min-h-0">
            <UserForm
              mode={mode}
              menus={menus}
              permissionCatalog={permissionCatalog}
              initialValues={{
                username: user.name,
                email: user.email,
                phone: user.phone,
                active: user.status === "active",
                permissions: buildChecksByMenu(menus),
              }}
              onCancel={onClose}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserModal;
