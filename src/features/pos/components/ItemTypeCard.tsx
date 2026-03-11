import Placeholder from "../../../assets/svg/upload-image.svg?react";

interface Props {
  label: string;
  image?: string | null;
  onClick: () => void;
}

const ItemTypeCard: React.FC<Props> = ({ label, image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="
        group relative rounded overflow-hidden bg-[#d3d2d2]
        aspect-square cursor-pointer transition-all duration-200
        hover:bg-white hover:-translate-y-1 hover:shadow-lg
      "
    >
      {image ? (
        <img src={image} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Placeholder className="w-[90px] h-[90px] text-[#BABABA]" />
        </div>
      )}

      <div className="absolute bottom-2 left-3">
        <div className="text-sm tracking-wide text-white group-hover:text-[#06284B]">
          {label}
        </div>
      </div>
    </div>
  );
};

export default ItemTypeCard;
