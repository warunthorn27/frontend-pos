import React, { useState } from "react";
import type {
  PermissionChecksByMenu,
  PermissionAction,
} from "../../types/permission";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow.svg?react";

type Props = {
  menus?: string[];
  checksByMenu: PermissionChecksByMenu;
  onToggle: (
    menu: string,
    action: "all" | PermissionAction,
    checked: boolean,
  ) => void;
  disabled?: boolean;
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
};

//PRODUCT MENU MAPPING

const PRODUCT_MENU_MAPPING = [
  { key: "Product Master", label: "Product Master" },
  { key: "Stone", label: "Stone / Diamond" },
  { key: "Semi-Mount", label: "Semi - Mount" },
  { key: "Accessories", label: "Accessories" },
  { key: "Others", label: "Others" },
  { key: "Product List", label: "Product List" },
];

// TYPE

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

//ROW

const checkboxClass =
  "w-4 h-4 rounded border border-gray-300 checked:border-black checked:bg-white";

function PermissionRow({
  menu,
  label,
  checksByMenu,
  onToggle,
  isParent,
  isChild,
  isExpanded,
  onToggleExpand,
  onParentToggle,
  disabled,
}: PermissionRowProps) {
  const c = checksByMenu[menu];

  return (
    <tr className="border-t border-gray-100">
      <td className="px-6 py-4">
        <div
          className={`flex items-center ${
            isParent ? "cursor-pointer select-none" : ""
          }`}
          onClick={isParent ? onToggleExpand : undefined}
        >
          {isParent && (
            <span className="mr-2 text-xs">{isExpanded ? "⌄" : "›"}</span>
          )}
          <span className={isChild ? "" : ""}>{label}</span>
        </div>
      </td>

      {(["all", "view", "add", "update", "delete", "print"] as const).map(
        (action) => (
          <td key={action} className="px-6 py-4 text-center">
            <input
              type="checkbox"
              className={`${checkboxClass} ${
                disabled ? "opacity-40 cursor-not-allowed" : ""
              }`}
              checked={c?.[action] ?? false}
              disabled={disabled}
              onChange={(e) => {
                if (disabled) return;
                if (isParent && onParentToggle) {
                  onParentToggle(action, e.target.checked);
                } else if (onToggle) {
                  onToggle(menu, action, e.target.checked);
                }
              }}
            />
          </td>
        ),
      )}
    </tr>
  );
}

// MAIN TABLE

export default function PermissionTable({
  menus = [],
  checksByMenu,
  onToggle,
  disabled = false,
}: Props) {
  // console.log("MENUS FROM API:", menus);

  const tree = buildMenuTree(menus);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

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
    <div className="overflow-x-auto">
      <h2 className="text-lg font-normal text-[#06284B] mb-6">
        Select permission for this user.
      </h2>
      <table className="w-full text-lg border-[#F0F0F2]">
        <thead className="bg-[#F7F7F7]">
          <tr>
            <th className="px-6 py-4 text-left font-normal">Menu</th>
            {["All", "View", "Add", "Edit", "Delete", "Print"].map((h) => (
              <th key={h} className="px-6 py-4 text-center font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tree.map((node) => {
            if (node.type === "group") {
              const expanded = expandedGroups[node.parent];

              return (
                <React.Fragment key={node.parent}>
                  {/* Product */}
                  <tr className="border-t border-gray-100">
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-2 cursor-pointer select-none"
                        onClick={() => toggleGroup(node.parent)}
                      >
                        <span>Product</span>

                        <DropdownArrowIcon
                          className={`transition-transform duration-200 ${
                            expanded ? "rotate-90" : "rotate-0"
                          }`}
                        />
                      </div>
                    </td>

                    {(
                      [
                        "all",
                        "view",
                        "add",
                        "update",
                        "delete",
                        "print",
                      ] as const
                    ).map((action) => (
                      <td key={action} className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          className={`${checkboxClass} ${
                            disabled ? "opacity-40 cursor-not-allowed" : ""
                          }`}
                          checked={isGroupChecked(node.children, action)}
                          disabled={disabled}
                          ref={(el) => {
                            if (el) {
                              el.indeterminate = isGroupIndeterminate(
                                node.children,
                                action,
                              );
                            }
                          }}
                          onChange={(e) => {
                            if (disabled) return;
                            toggleGroupPermission(
                              node.children,
                              action,
                              e.target.checked,
                            );
                          }}
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Children */}
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
            }

            return (
              <PermissionRow
                key={node.menu}
                menu={node.menu}
                label={node.menu}
                checksByMenu={checksByMenu}
                onToggle={onToggle}
                disabled={disabled}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
