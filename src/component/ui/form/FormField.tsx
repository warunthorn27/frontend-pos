interface Props {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const labelStyle = "block text-base mb-2";

const FormField: React.FC<Props> = ({ label, required, children }) => (
  <div>
    <label className={labelStyle}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export default FormField;

export const FormTextarea: React.FC<TextareaProps> = ({
  className,
  disabled,
  ...props
}) => (
  <textarea
    {...props}
    disabled={disabled}
    className={`
      w-full min-h-[84px] rounded-md border px-3 py-2 text-sm
      focus:outline-none focus:border-[#005AA7] transition-colors
      ${
        disabled
          ? "bg-[#F1F1F1] border-[#E6E6E6] text-black resize-none cursor-default"
          : "bg-white border-[#CFCFCF]"
      }
      ${className ?? ""}
    `}
  />
);
