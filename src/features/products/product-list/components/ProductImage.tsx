import type { FC } from "react";
import BlankImageIcon from "../../../../assets/svg/upload-image.svg?react";

type Props = {
  imageUrl: string | null;
  alt?: string;
  className?: string;
};

const ProductImage: FC<Props> = ({
  imageUrl,
  alt = "product image",
  className = "h-[40px] w-[40px]",
}) => {
  const hasImage = imageUrl && imageUrl.trim().length > 0;

  return (
    <div
      className={`${className} aspect-square rounded-lg bg-[#F1F3F7] border border-[#E6E6E6] overflow-hidden flex items-center justify-center`}
    >
      {hasImage ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <BlankImageIcon className="w-6 h-6 text-[#9AA3B2]" />
      )}
    </div>
  );
};

export default ProductImage;
