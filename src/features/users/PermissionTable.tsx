import React, { useState } from "react";
import type {
  PermissionChecksByMenu,
  PermissionAction,
} from "../../types/permission";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow.svg?react";
import Checkbox from "../../component/ui/Checkbox";

//  1. TYPES & PROPS
type Props = {
  menus?: string[];
  checksByMenu: PermissionChecksByMenu;
  onToggle: (
    menu: string,
    action: "all" | PermissionAction,
    checked: boolean,
  ) => void;
  disabled?: boolean;
  mode?: "create" | "view" | "edit";
};

type PermissionRowProps = {
  menu: string;
  label: string;
  checksByMenu: PermissionChecksByMenu;
  onToggle?: Props["onToggle"];
  isParent?: boolean;
  isChild?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onParentToggle?: (action: PermissionAction | "all", checked: boolean) => void;
  disabled?: boolean;
  getChecked?: (action: PermissionAction | "all") => boolean;
  getIndeterminate?: (action: PermissionAction | "all") => boolean;
};

type MenuNode =
  | {
      type: "group";
      parent: string;
      children: { key: string; label: string }[];
    }
  | {
      type: "single";
      menu: string;
    };

//  2. CONSTANTS (STATIC DATA)
const PRODUCT_MENU_MAPPING = [
  { key: "Product Master", label: "Product Master" },
  { key: "Stone", label: "Stone / Diamond" },
  { key: "Semi-Mount", label: "Semi - Mount" },
  { key: "Accessories", label: "Accessories" },
  { key: "Others", label: "Others" },
  { key: "Product List", label: "Product List" },
];

//   3. HELPERS / DATA BUILDERS - ทำหน้าที่แปลงข้อมูล
function buildMenuTree(menus: string[]): MenuNode[] {
  const productChildren = PRODUCT_MENU_MAPPING.filter((m) =>
    menus.includes(m.key),
  );

  const productKeys = productChildren.map((m) => m.key);
  const otherMenus = menus.filter((m) => !productKeys.includes(m));

  const result: MenuNode[] = [];

  if (productChildren.length > 0) {
    result.push({
      type: "group",
      parent: "Product",
      children: productChildren,
    });
  }

  otherMenus.forEach((menu) => {
    result.push({
      type: "single",
      menu,
    });
  });

  return result;
}

/* 
   4. SUB COMPONENT
   - 1 แถวของ permission table
   - ใช้ได้ทั้ง parent / child
 */
function PermissionRow({
  menu,
  label,
  checksByMenu,
  onToggle,
  isParent,
  isExpanded,
  onToggleExpand,
  onParentToggle,
  disabled,
  getChecked,
  getIndeterminate,
}: PermissionRowProps) {
  const c = checksByMenu[menu];

  return (
    <tr className="bg-white border-b">
      {/* MENU CELL */}
      <td className="px-6 py-4">
        <div
          className={`flex items-center gap-2 ${
            isParent ? "cursor-pointer select-none" : ""
          }`}
          onClick={isParent ? onToggleExpand : undefined}
        >
          <span className="font-light text-base text-[#06284B]">{label}</span>

          {isParent && (
            <DropdownArrowIcon
              className={`w-5 h-5 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : "rotate-0"
              }`}
            />
          )}
        </div>
      </td>

      {/* PERMISSION CELLS */}
      {(["all", "view", "add", "update", "delete", "print"] as const).map(
        (action) => (
          <td key={action} className="px-6 py-4 text-center">
            <Checkbox
              checked={getChecked ? getChecked(action) : (c?.[action] ?? false)}
              indeterminate={
                getIndeterminate ? getIndeterminate(action) : false
              }
              disabled={disabled}
              onChange={(checked) => {
                if (disabled) return;

                if (isParent && onParentToggle) {
                  onParentToggle(action, checked);
                } else if (onToggle) {
                  onToggle(menu, action, checked);
                }
              }}
            />
          </td>
        ),
      )}
    </tr>
  );
}

/* 
   5. MAIN COMPONENT
   - คุม state
   - render table
 */
export default function PermissionTable({
  menus = [],
  checksByMenu,
  onToggle,
  disabled = false,
  mode = "edit",
}: Props) {
  const tree = buildMenuTree(menus);

  /* STATE */
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  /* HANDLERS */

  const toggleGroup = (parent: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [parent]: !prev[parent],
    }));
  };

  const toggleGroupPermission = (
    children: { key: string }[],
    action: PermissionAction | "all",
    checked: boolean,
  ) => {
    children.forEach((child) => {
      onToggle(child.key, action, checked);
    });
  };

  const isGroupChecked = (
    children: { key: string }[],
    action: PermissionAction | "all",
  ) => children.every((c) => checksByMenu[c.key]?.[action]);

  const isGroupIndeterminate = (
    children: { key: string }[],
    action: PermissionAction | "all",
  ) => {
    const values = children.map((c) => checksByMenu[c.key]?.[action]);
    return values.some(Boolean) && !values.every(Boolean);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <h2 className="text-lg font-normal text-[#06284B] mb-6">
        {mode === "view" ? "Permission" : "Select permission for this user."}
      </h2>

      {/* TABLE + SCROLL */}
      <div className="relative min-h-0 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] shadow-sm">
        <div className="h-full overflow-y-auto hide-scrollbar">
          <table className="w-full text-left table-auto">
            {/* HEADER */}
            <thead className="sticky top-0 z-10 bg-[#F1F1F1]">
              <tr>
                <th className="px-6 py-4 font-normal text-base w-64">Menu</th>
                {["All", "View", "Add", "Edit", "Delete", "Print"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 font-normal text-left text-base"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {/* 1. GROUP MENU (Product) */}
              {tree
                .filter((n) => n.type === "group")
                .map((node) => {
                  const expanded = expandedGroups[node.parent];

                  return (
                    <React.Fragment key={node.parent}>
                      {/* PARENT ROW */}
                      <PermissionRow
                        menu={node.parent}
                        label={node.parent}
                        checksByMenu={checksByMenu}
                        isParent
                        isExpanded={expanded}
                        onToggleExpand={() => toggleGroup(node.parent)}
                        onParentToggle={(action, checked) =>
                          toggleGroupPermission(node.children, action, checked)
                        }
                        getChecked={(action) =>
                          isGroupChecked(node.children, action)
                        }
                        getIndeterminate={(action) =>
                          isGroupIndeterminate(node.children, action)
                        }
                        disabled={disabled}
                      />

                      {/* CHILD ROWS */}
                      {expanded &&
                        node.children.map((child) => (
                          <PermissionRow
                            key={child.key}
                            menu={child.key}
                            label={child.label}
                            checksByMenu={checksByMenu}
                            onToggle={onToggle}
                            isChild
                            disabled={disabled}
                          />
                        ))}
                    </React.Fragment>
                  );
                })}

              {/* 2. SINGLE MENU (เช่น Customer) — ต้องอยู่ท้ายเสมอ */}
              {tree
                .filter((n) => n.type === "single")
                .map((node) => (
                  <PermissionRow
                    key={node.menu}
                    menu={node.menu}
                    label={node.menu}
                    checksByMenu={checksByMenu}
                    onToggle={onToggle}
                    disabled={disabled}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
