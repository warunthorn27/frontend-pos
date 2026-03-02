import {
  detectCountryFromPhone,
  COUNTRIES,
  formatPhoneForDisplay,
} from "../../utils/phone";

const PhoneView = ({ phone }: { phone?: string }) => {
  if (!phone) {
    return (
      <div className="flex h-[38px] rounded-md border border-[#CFCFCF] bg-[#F1F1F1] text-black">
        <div className="px-3 text-sm flex items-center text-black">-</div>
      </div>
    );
  }

  const country = detectCountryFromPhone(phone);
  const dial = COUNTRIES.find((c) => c.code === country)?.dial;
  const local = formatPhoneForDisplay(phone);

  return (
    <div className="flex h-[38px] rounded-md border bg-[#F1F1F1] text-black">
      <div className="px-3 text-sm flex items-center">{dial}</div>
      <div className="w-px bg-[#E5E5E5]" />
      <div className="flex-1 px-3 text-sm flex items-center">{local}</div>
    </div>
  );
};
export default PhoneView;
