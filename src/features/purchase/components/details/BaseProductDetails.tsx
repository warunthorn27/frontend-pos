// ProductMaster + SemiMount

import type { FormattedProductResponse } from "../../../../types/product/response";
import { getCategoryLabel } from "../../../../utils/categoryOptions";
import DetailRow from "./DetailRow";

type Props = {
  data: FormattedProductResponse;
};

export default function BaseProductDetails({ data }: Props) {
  return (
    <div className="space-y-4">
      {/* ================= PRODUCT ================= */}
      <section className="pb-3 border-b">
        <h3 className="text-[#084072] font-normal mb-2">Product Details</h3>

        <DetailRow
          label="Category"
          value={getCategoryLabel(data.product_category)}
        />
        <DetailRow label="Code" value={data.code} />
        <DetailRow label="Product Name" value={data.product_name} />
        <DetailRow label="Item Type" value={data.item_type?.name} />
        <DetailRow label="Product Size" value={data.product_size} />
        <DetailRow label="Metal" value={data.metal?.name} />
        <DetailRow label="Metal Color" value={data.metal_color?.name} />
        <DetailRow
          label="Nwt"
          value={`${data.net_weight ?? "-"} ${data.unit ?? ""}`}
        />
        <DetailRow
          label="Gwt"
          value={`${data.gross_weight ?? "-"} ${data.unit ?? ""}`}
        />
        <DetailRow label="Description" value={data.description} />
      </section>

      {/* ================= PRIMARY STONE ================= */}
      {data.primary_stone && (
        <section className="pb-3 border-b">
          <h3 className="text-[#084072] font-normal mb-2">Primary Stone</h3>

          <DetailRow
            label="Stone Name"
            value={data.primary_stone.stone_name?.name}
          />
          <DetailRow label="Shape" value={data.primary_stone.shape?.name} />
          <DetailRow label="Size" value={data.primary_stone.size} />
          <DetailRow
            label="S. Weight"
            value={`${data.primary_stone.weight ?? "-"} ${
              data.primary_stone.unit ?? ""
            }`}
          />
          <DetailRow label="Color" value={data.primary_stone.color} />
          <DetailRow label="Cutting" value={data.primary_stone.cutting?.name} />
          <DetailRow label="Quality" value={data.primary_stone.quality?.name} />
          <DetailRow label="Clarity" value={data.primary_stone.clarity?.name} />
        </section>
      )}

      {/* ================= ADDITIONAL STONES ================= */}
      {data.additional_stones && data.additional_stones.length > 0 && (
        <section>
          <h3 className="text-[#084072] font-normal mb-2">Additional Stones</h3>

          {data.additional_stones.map((stone, index) => (
            <div key={index} className="mb-2 border-b pb-3">
              <DetailRow label="Stone Name" value={stone.stone_name?.name} />
              <DetailRow label="Shape" value={stone.shape?.name} />
              <DetailRow label="Size" value={stone.size} />
              <DetailRow
                label="S. Weight"
                value={`${stone.weight ?? "-"} ${stone.unit ?? ""}`}
              />
              <DetailRow label="Color" value={stone.color} />
              <DetailRow label="Cutting" value={stone.cutting?.name} />
              <DetailRow label="Quality" value={stone.quality?.name} />
              <DetailRow label="Clarity" value={stone.clarity?.name} />
            </div>
          ))}
        </section>
      )}

      {/* ================= ACCESSORIES ================= */}
      {data.related_accessories && data.related_accessories.length > 0 && (
        <section>
          <h3 className="text-[#084072] font-normal mb-2">Accessories</h3>

          {data.related_accessories.map((acc, index) => (
            <div key={index} className="mb-2">
              <DetailRow
                label="Product Code"
                value={acc.product_id?.product_code}
              />
              <DetailRow
                label="Product Name"
                value={acc.product_id?.product_name}
              />
              <DetailRow label="Size" value={acc.size} />
              <DetailRow
                label="Weight"
                value={`${acc.weight ?? "-"} ${acc.unit ?? ""}`}
              />
              <DetailRow label="Metal" value={acc.metal?.name} />
              <DetailRow label="Description" value={acc.description} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
