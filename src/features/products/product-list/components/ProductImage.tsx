import BlankImageIcon from "../../../../assets/svg/upload-image.svg?react";

type Props = {
  imageUrl: string | null;
  alt?: string;
};

const ProductImage: React.FC<Props> = ({ imageUrl, alt = "product image" }) => {
  return (
    <div className="h-[40px] w-[40px] rounded-md bg-[#F1F3F7] border border-[#E6E6E6] overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full grid place-items-center text-[10px] text-[#9AA3B2]">
          <BlankImageIcon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default ProductImage;
