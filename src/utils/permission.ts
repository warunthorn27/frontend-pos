import type {
  PermissionAction,
  PermissionCatalog,
  PermissionChecks,
  PermissionChecksByMenu,
  PermissionDTO,
} from "../types/permission";

const ACTIONS: PermissionAction[] = [
  "view",
  "add",
  "update",
  "delete",
  "print",
  "export",
];

export function buildCatalog(list: PermissionDTO[]): PermissionCatalog {
  const catalog: PermissionCatalog = {};
  for (const p of list) {
    const menu = p.permission_menu;
    catalog[menu] ??= {};
    catalog[menu][p.permission_action] = p;
  }
  return catalog;
}

export function defaultChecks(): PermissionChecks {
  return {
    all: false,
    view: true, // default view
    add: false,
    update: false,
    delete: false,
    print: false,
    export: false,
  };
}

export function buildChecksByMenu(menus: string[]): PermissionChecksByMenu {
  const out: PermissionChecksByMenu = {};
  for (const m of menus) out[m] = defaultChecks();
  return out;
}

export function recomputeAll(c: PermissionChecks): PermissionChecks {
  const all = ACTIONS.every((a) => c[a] === true);
  return { ...c, all };
}

export function toggleCheck(
  prev: PermissionChecksByMenu,
  menu: string,
  key: "all" | PermissionAction,
  checked: boolean
): PermissionChecksByMenu {
  const current = prev[menu] ?? defaultChecks();

  if (key === "all") {
    const next: PermissionChecks = {
      all: checked,
      view: checked,
      add: checked,
      update: checked,
      delete: checked,
      print: checked,
      export: checked,
    };
    return { ...prev, [menu]: next };
  }

  const next = recomputeAll({ ...current, [key]: checked });
  return { ...prev, [menu]: next };
}

export function toSelectedPermissionIds(
  checksByMenu: PermissionChecksByMenu,
  catalog: PermissionCatalog
): string[] {
  const ids: string[] = [];
  for (const [menu, checks] of Object.entries(checksByMenu)) {
    const meta = catalog[menu];
    if (!meta) continue;

    for (const a of ACTIONS) {
      if (checks[a]) {
        const p = meta[a];
        if (p?._id) ids.push(p._id);
      }
    }
  }
  return ids;
}
