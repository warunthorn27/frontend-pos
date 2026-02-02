export const MASTER_TYPES = {
  stoneName: "stone_name",
  shape: "shape",
  cutting: "cutting",
  quality: "quality",
  clarity: "clarity",
  itemType: "item_type",
  metal: "metal",
  accessory: "accessory",
  metalColor: "metal_color",
} as const;

export type MasterType = (typeof MASTER_TYPES)[keyof typeof MASTER_TYPES];

export type MasterItem = {
  _id: string;
  master_name: string;
  master_type: MasterType;
  master_color?: string | null;
};

export type MasterResponse = {
  _id: string;
  master_name: string;
  master_type: MasterType;
  master_color?: string | null;
};

export type MastersListResponse = {
  success: boolean;
  count: number;
  data: MasterResponse[];
};

export type CreateMasterResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    master_name: string;
    master_type: string;
    master_color?: string;
  };
};

export type BackendMaster = {
  _id: string;
  name: string;
  code?: string;
  master_name?: string;
  master_type?: string;
};
