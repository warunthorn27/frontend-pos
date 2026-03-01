import React from "react";
import IconPencil from "../../assets/svg/edit.svg?react";
import IconTrash from "../../assets/svg/trash.svg?react";

function IconButton({
  icon,
  onClick,
  color,
  label,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  color: "yellow" | "red";
  label: string;
}) {
  const styles =
    color === "yellow"
      ? "bg-[#FDFCDB] text-[#FFCC00] hover:bg-[#FFCC00] hover:text-white"
      : "bg-[#FFDFDF] text-[#E71010] hover:bg-[#E71010] hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 w-8 rounded-[6px] grid place-items-center ${styles}`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

type Props = {
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const CustomerActionButtons: React.FC<Props> = ({ id, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-center gap-[10px]">
      <IconButton
        color="yellow"
        onClick={() => onEdit?.(id)}
        icon={<IconPencil />}
        label="Edit"
      />
      <IconButton
        color="red"
        onClick={() => onDelete?.(id)}
        icon={<IconTrash />}
        label="Delete"
      />
    </div>
  );
};

export default CustomerActionButtons;
