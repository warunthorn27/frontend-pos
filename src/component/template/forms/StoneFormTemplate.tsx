import StoneDiamondInfoCard from "../../../features/products/stone-diamond/components/StoneDiamondInfoCard";
import type { StoneDiamondForm } from "../../../types/product/form";
import type { SelectOption } from "../../../types/shared/select";

type Props = {
  value: StoneDiamondForm;
  mode: "create" | "edit" | "view";
  onChange: (patch: Partial<StoneDiamondForm>) => void;
  stoneNameOptions: SelectOption[];
  shapeOptions: SelectOption[];
  cuttingOptions: SelectOption[];
  qualityOptions: SelectOption[];
  clarityOptions: SelectOption[];
};

export default function StoneFormTemplate({
  value,
  mode,
  onChange,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
}: Props) {
  return (
    <StoneDiamondInfoCard
      value={value}
      mode={mode}
      onChange={onChange}
      stoneNameOptions={stoneNameOptions}
      shapeOptions={shapeOptions}
      cuttingOptions={cuttingOptions}
      qualityOptions={qualityOptions}
      clarityOptions={clarityOptions}
    />
  );
}
