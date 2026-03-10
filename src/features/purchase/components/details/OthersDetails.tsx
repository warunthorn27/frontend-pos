import type { FormattedProductResponse } from "../../../../types/product/response";
import { getCategoryLabel } from "../../../../utils/categoryOptions";
import DetailRow from "./DetailRow";

type Props = {
  data: FormattedProductResponse;
};

export default function OthersDetails({ data }: Props) {
  const formatWeight = (weight?: number | null, unit?: string | null) => {
    if (weight == null) return null;
    return `${weight} ${unit ?? ""}`;
  };

  return (
    <div className="space-y-4">
      <section>
        <h3 className="text-[#084072] font-normal mb-2">Others Details</h3>

        <DetailRow
          label="Category"
          value={getCategoryLabel(data.product_category)}
        />
        <DetailRow label="Product Name" value={data.product_name} />
        <DetailRow label="Code" value={data.code} />
        <DetailRow label="Product Size" value={data.product_size} />
        <DetailRow
          label="Weight"
          value={formatWeight(data.weight, data.unit)}
        />
        <DetailRow label="Description" value={data.description} />
        {/* <DetailRow
          label="Status"
          value={data.is_active ? "Active" : "Inactive"}
        /> */}
      </section>
    </div>
  );
}
