import type { FormattedProductResponse } from "../../../../types/product/response";
import { getCategoryLabel } from "../../../../utils/categoryOptions";
import DetailRow from "./DetailRow";

type Props = {
  data: FormattedProductResponse;
};

export default function StoneDetails({ data }: Props) {
  const stone = data.primary_stone;

  return (
    <div className="space-y-4">
      <section>
        <h3 className="text-[#084072] font-normal mb-2">Product Details</h3>

        <DetailRow
          label="Category"
          value={getCategoryLabel(data.product_category)}
        />
        <DetailRow label="Product Name" value={data.product_name} />
        <DetailRow label="Code" value={data.code} />
        <DetailRow label="Description" value={data.description || null} />

        {stone && (
          <>
            <DetailRow label="Stone Name" value={stone.stone_name?.name} />
            <DetailRow label="Shape" value={stone.shape?.name} />
            <DetailRow label="Size" value={stone.size} />
            <DetailRow
              label="S. Weight"
              value={
                data.weight != null ? `${data.weight} ${data.unit ?? ""}` : null
              }
            />
            <DetailRow label="Color" value={stone.color} />
            <DetailRow label="Cutting" value={stone.cutting?.name} />
            <DetailRow label="Quality" value={stone.quality?.name} />
            <DetailRow label="Clarity" value={stone.clarity?.name} />
          </>
        )}
      </section>
    </div>
  );
}
