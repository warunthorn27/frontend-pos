import type { FormattedProductResponse } from "../../../../types/product/response";
import { getCategoryLabel } from "../../../../utils/categoryOptions";
import DetailRow from "./DetailRow";

type Props = {
  data: FormattedProductResponse;
};

export default function AccessoryDetails({ data }: Props) {
  return (
    <div className="space-y-4">
      <section>
        <h3 className="text-[#084072] font-normal mb-2">Accessory Details</h3>

        <DetailRow
          label="Category"
          value={getCategoryLabel(data.product_category)}
        />
        <DetailRow label="Product Name" value={data.product_name} />
        <DetailRow label="Code" value={data.code} />
        <DetailRow label="Size" value={data.product_size} />
        <DetailRow label="Metal" value={data.metal?.name} />
        <DetailRow
          label="Weight"
          value={`${data.weight ?? "-"} ${data.unit ?? ""}`}
        />
        <DetailRow label="Description" value={data.description} />
      </section>
    </div>
  );
}
