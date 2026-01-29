type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "required"
> & {
  label: string;
  required?: boolean;
};

function Input({ label, required, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        {...props}
        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default function PurchaseInfoCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-[1400px]">
      <Input label="Purchase Number" value="2026000001" disabled />
      <Input label="Date" placeholder="MM / DD / YYYY" required />
      <Input label="Vendor" placeholder="Name" required />
      <Input label="Ref.1" />
      <Input label="Ref.2" />
    </div>
  );
}
