import DatePicker from "../../../component/ui/Datepicker";
import CurrencySelect from "../../../component/ui/form/CurrencySelect";
import Input from "../../../component/ui/form/Input";
import FormField from "../../../component/ui/form/FormField";

interface Props {
  purchaseNumber: string;
  currency: string;
  date: string;
  exchangeRate: number;
  companyCurrency: string;

  vendor: string;
  ref1: string;
  ref2: string;

  onVendorChange: (value: string) => void;
  onRef1Change: (value: string) => void;
  onRef2Change: (value: string) => void;

  onDateChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onExchangeRateChange: (value: number) => void;
}

export default function PurchaseInfoCard({
  purchaseNumber,
  currency,
  date,
  exchangeRate,
  companyCurrency,

  vendor,
  ref1,
  ref2,

  onVendorChange,
  onRef1Change,
  onRef2Change,

  onDateChange,
  onCurrencyChange,
  onExchangeRateChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-6 w-full">
      <FormField label="Purchase Number">
        <Input value={purchaseNumber} disabled />
      </FormField>

      <FormField label="Date" required>
        <DatePicker value={date} onChange={onDateChange} />
      </FormField>

      <FormField label="Vendor" required>
        <Input
          placeholder="Name"
          value={vendor}
          onChange={(e) => onVendorChange(e.target.value)}
        />
      </FormField>

      <FormField label="Ref.1">
        <Input value={ref1} onChange={(e) => onRef1Change(e.target.value)} />
      </FormField>

      <FormField label="Ref.2">
        <Input value={ref2} onChange={(e) => onRef2Change(e.target.value)} />
      </FormField>

      <div>
        <CurrencySelect
          label="Currency"
          value={currency}
          onChange={onCurrencyChange}
          required
        />

        {companyCurrency && (
          <p className="text-xs font-light text-gray-600 mt-2">
            Company currency : {companyCurrency}
          </p>
        )}
      </div>

      <FormField label="Exchange Rate">
        <Input
          value={exchangeRate}
          onChange={(e) => onExchangeRateChange(Number(e.target.value))}
        />
      </FormField>
    </div>
  );
}
