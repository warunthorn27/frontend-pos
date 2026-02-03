import { useEffect, useState } from "react";
import {
  fetchAccessoryMaster,
  fetchMasterOptions,
} from "../../../services/master";
import type {
  AccessoriesOption,
  SelectOption,
} from "../../../types/shared/select";
import { MASTER_TYPES } from "../../../types/master";

export function useProductMasters() {
  const [loading, setLoading] = useState(true);
  const [stoneNameOptions, setStoneNameOptions] = useState<SelectOption[]>([]);
  const [shapeOptions, setShapeOptions] = useState<SelectOption[]>([]);
  const [cuttingOptions, setCuttingOptions] = useState<SelectOption[]>([]);
  const [qualityOptions, setQualityOptions] = useState<SelectOption[]>([]);
  const [clarityOptions, setClarityOptions] = useState<SelectOption[]>([]);
  const [itemTypeOptions, setItemTypeOptions] = useState<SelectOption[]>([]);
  const [metalOptions, setMetalOptions] = useState<SelectOption[]>([]);
  const [accessoriesOptions, setAccessoriesOptions] = useState<
    AccessoriesOption[]
  >([]);

  const loadMasters = async () => {
    setLoading(true);

    try {
      const [
        stoneNames,
        shapes,
        cuttings,
        qualities,
        clarities,
        itemTypes,
        metals,
        accessoriesRaw,
      ] = await Promise.all([
        fetchMasterOptions(MASTER_TYPES.stoneName),
        fetchMasterOptions(MASTER_TYPES.shape),
        fetchMasterOptions(MASTER_TYPES.cutting),
        fetchMasterOptions(MASTER_TYPES.quality),
        fetchMasterOptions(MASTER_TYPES.clarity),
        fetchMasterOptions(MASTER_TYPES.itemType),
        fetchMasterOptions(MASTER_TYPES.metal),
        fetchAccessoryMaster(),
      ]);

      setStoneNameOptions(stoneNames);
      setShapeOptions(shapes);
      setCuttingOptions(cuttings);
      setQualityOptions(qualities);
      setClarityOptions(clarities);
      setItemTypeOptions(itemTypes);
      setMetalOptions(metals);

      const accessories: AccessoriesOption[] = accessoriesRaw.map((a) => ({
        value: a._id, // id
        label: a.product_name, // ใช้โชว์ใน dropdown
        productCode: a.product_code,
        productName: a.product_name,
        productSize: a.size ?? "",
        metal: a.metal ?? "",
        defaultWeight: a.weight != null ? String(a.weight) : "",
      }));

      setAccessoriesOptions(accessories);
    } catch (error) {
      console.error("Failed to load master options:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadMasters();
    };
    load();
  }, []);

  return {
    loading,
    stoneNameOptions,
    shapeOptions,
    cuttingOptions,
    qualityOptions,
    clarityOptions,
    itemTypeOptions,
    metalOptions,
    accessoriesOptions,
    setMetalOptions,
    reloadMasters: loadMasters,
  };
}
