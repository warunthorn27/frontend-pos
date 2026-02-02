import AccessoriesInfoCard from "../../../features/products/accessories/components/AccessoriesInfoCard";
import type { AccessoriesForm } from "../../../types/product/form";
import type { SelectOption } from "../../../types/shared/select";

type Props = {
  value: AccessoriesForm;
  onChange: (patch: Partial<AccessoriesForm>) => void;
  metalOptions: SelectOption[];
  mode: "view" | "edit";
};

export default function AccessoriesFormTemplate({
  value,
  mode,
  onChange,
  metalOptions,
}: Props) {
  return (
    <AccessoriesInfoCard
      value={value}
      mode={mode}
      onChange={onChange}
      metalOptions={metalOptions}
    />
  );
}
