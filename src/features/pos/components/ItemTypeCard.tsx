interface Props {
  label: string;
  image: string;
}

const ItemTypeCard: React.FC<Props> = ({ label, image }) => {
  return (
    <div className="w-56">
      <div className="rounded overflow-hidden bg-gray-100">
        <img src={image} alt={label} className="w-full h-40 object-cover" />
      </div>

      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
};

export default ItemTypeCard;
