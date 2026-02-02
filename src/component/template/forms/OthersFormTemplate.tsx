import OthersInfoCard from "../../../features/products/others/components/OthersInfoCard";
import type { OthersForm } from "../../../types/product/form";

type Props = {
  value: OthersForm;
  onChange: (patch: Partial<OthersForm>) => void;
  mode: "view" | "edit";
};

export default function OthersFormTemplate({ value, onChange, mode }: Props) {
  return <OthersInfoCard value={value} onChange={onChange} mode={mode} />;
}
