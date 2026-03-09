import type { FormattedProductResponse } from "../../../types/product/response";
import AccessoryDetails from "./details/AccessoryDetails";
import BaseProductDetails from "./details/BaseProductDetails";
import OthersDetails from "./details/OthersDetails";
import StoneDetails from "./details/StoneDetails";

type Props = {
  data: FormattedProductResponse;
};

export default function PurchaseProductDetailsContent({ data }: Props) {
  switch (data.product_category) {
    case "productmaster":
    case "semimount":
      return <BaseProductDetails data={data} />;

    case "stone":
      return <StoneDetails data={data} />;

    case "accessory":
      return <AccessoryDetails data={data} />;

    case "others":
      return <OthersDetails data={data} />;

    default:
      return null;
  }
}
