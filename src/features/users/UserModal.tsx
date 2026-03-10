import React, { useState } from "react";
import RemoveIcon from "../../assets/svg/remove.svg?react";
import EditIcon from "../../assets/svg/edit.svg?react";
import UserForm from "./UserForm";
import type { UserFormInput, UserListItem } from "../../types/user";
import { buildChecksByMenu, idsToChecksByMenu } from "../../utils/permission";
import type { PermissionCatalog } from "../../types/permission";
import Modal from "@mui/material/Modal";
import DiscardChangesDialog from "../../component/dialog/DiscardChangesDialog";

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
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const initialValues = React.useMemo(() => {
    if (!user) return undefined;

    return {
      username: user.name,
      email: user.email,
      phone: user.phone,
      active: user.status === "active",
      permissions:
        user.permissions && user.permissions.length > 0
          ? idsToChecksByMenu(user.permissions, permissionCatalog, menus)
          : buildChecksByMenu(menus),
    };
  }, [user, permissionCatalog, menus]);

  if (!open || !user) return null;

  const handleClose = () => {
    if (isDirty && mode !== "view") {
      setShowDiscard(true);
    } else {
      setIsDirty(false);
      setShowDiscard(false);
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setIsDirty(false);
    setShowDiscard(false);
    onClose();
  };

  const handleSubmit = async (data: UserFormInput) => {
    await onSubmit(data);
    setIsDirty(false);
    setShowDiscard(false);
  };


  return (
    <>
      <Modal open={open} onClose={handleClose}>
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

                <button onClick={handleClose}>
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
                initialValues={initialValues}
                onCancel={() => {
                  setIsDirty(false);
                  setShowDiscard(false);
                  onClose();
                }}
                onSubmit={handleSubmit}
                onDirtyChange={setIsDirty}
              />
            </div>
          </div>
        </div>
      </Modal>

      <DiscardChangesDialog
        open={showDiscard}
        onClose={() => setShowDiscard(false)}
        onConfirm={handleConfirmDiscard}
      />
    </>
  );
};

export default UserModal;
