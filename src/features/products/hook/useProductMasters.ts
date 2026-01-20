import { useEffect, useState } from "react";
import { fetchMasterOptions } from "../../../services/master";
import type { SelectOption } from "../../../types/shared/select";

export function useProductMasters() {
  const [loading, setLoading] = useState(true);

  const [stoneNameOptions, setStoneNameOptions] = useState<SelectOption[]>([]);
  const [shapeOptions, setShapeOptions] = useState<SelectOption[]>([]);
  const [cuttingOptions, setCuttingOptions] = useState<SelectOption[]>([]);
  const [qualityOptions, setQualityOptions] = useState<SelectOption[]>([]);
  const [clarityOptions, setClarityOptions] = useState<SelectOption[]>([]);
  const [itemTypeOptions, setItemTypeOptions] = useState<SelectOption[]>([]);
  const [metalOptions, setMetalOptions] = useState<SelectOption[]>([]);
  const [accessoriesOptions, setAccessoriesOptions] = useState<SelectOption[]>(
    [],
  );

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
        accessories,
      ] = await Promise.all([
        fetchMasterOptions("stone_name"),
        fetchMasterOptions("shape"),
        fetchMasterOptions("cutting"),
        fetchMasterOptions("quality"),
        fetchMasterOptions("clarity"),
        fetchMasterOptions("item_type"),
        fetchMasterOptions("metal"),
        fetchMasterOptions("accessory"),
      ]);

      setStoneNameOptions(stoneNames);
      setShapeOptions(shapes);
      setCuttingOptions(cuttings);
      setQualityOptions(qualities);
      setClarityOptions(clarities);
      setItemTypeOptions(itemTypes);
      setMetalOptions(metals);
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

    reloadMasters: loadMasters,
  };
}
