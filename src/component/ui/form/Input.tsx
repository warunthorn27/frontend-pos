type Props = React.InputHTMLAttributes<HTMLInputElement>;

const inputStyle =
  "w-full h-[38px] rounded-md border border-[#CFCFCF] px-3 text-sm focus:outline-none focus:border-[#005AA7]";

const Input: React.FC<Props> = ({ className, disabled, ...props }) => {
  return (
    <input
      {...props}
      disabled={disabled}
      className={`
        ${inputStyle}
        ${
          disabled
            ? "bg-[#F1F1F1] border-[#E6E6E6] text-black cursor-default"
            : "bg-white border-[#CFCFCF]"
        }
        ${className ?? ""}
      `}
    />
  );
};

export default Input;
