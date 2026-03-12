import type {
  CatalogueProductItem,
  CatalogueMode,
} from "../../../types/pos/catalogue";

import ImagePlaceholder from "../../../assets/svg/upload-image.svg?react";

interface Props {
  item: CatalogueProductItem;
  mode: CatalogueMode;
  onClick?: (id: string) => void;
  onCustom?: (item: CatalogueProductItem) => void;
  onSell?: (item: CatalogueProductItem) => void;
}

const ProductCard: React.FC<Props> = ({ item, mode, onClick, onCustom, onSell }) => {
  return (
    <div
      onClick={() => onClick?.(item.id)}
      className="bg-white border border-gray-200 w-full flex flex-col cursor-pointer"
    >
      <div className="w-full h-[160px] bg-gray-100 relative flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl ?? ""}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImagePlaceholder className="w-10 h-10 text-gray-400" />
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="text-xs text-gray-400">{item.code}</div>
        <div className="text-sm text-[#06284B]">{item.name}</div>

        {item.description && (
          <div className="text-xs text-gray-500 line-clamp-2">
            {item.description}
          </div>
        )}

        <div className="text-xs mt-2 text-gray-500">
          {item.metal && <div>Metal : {item.metal}</div>}
          {item.metalColor && <div>Metal Color : {item.metalColor}</div>}
          {item.size && <div>Size : {item.size}</div>}
        </div>

        {mode === "inventory" && (
          <div className="mt-2 text-sm font-medium text-[#06284B]">
            {item.price?.toLocaleString()} {item.currency}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-3 justify-end">
          {mode === "inventory" && (
            <button 
              className="w-[96px] h-9 rounded text-sm bg-[#06284B] text-white"
              onClick={(e) => {
                e.stopPropagation();
                onSell?.(item);
              }}
            >
              Sell
            </button>
          )}

          <button
            className="w-[96px] h-9 rounded border border-gray-300 text-sm bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onCustom?.(item);
            }}
          >
            Custom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
