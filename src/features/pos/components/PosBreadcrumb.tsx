import BreadcrumbsIcon from "../../../assets/svg/dropdown-arrow.svg?react";

interface Props {
  items: {
    label: string;
    onClick?: () => void;
  }[];
}

const PosBreadcrumb: React.FC<Props> = ({ items }) => {
  return (
    <ol className="flex items-center whitespace-nowrap text-xl font-normal">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li key={index} className="inline-flex items-center px-1 gap-2">
            {item.onClick && !isLast ? (
              <button onClick={item.onClick} className="text-[#06284B]">
                {item.label}
              </button>
            ) : (
              <span className="font-normal text-[#06284B]">{item.label}</span>
            )}

            {!isLast && <BreadcrumbsIcon className="w-7 h-7 text-[#06284B]" />}
          </li>
        );
      })}
    </ol>
  );
};

export default PosBreadcrumb;
