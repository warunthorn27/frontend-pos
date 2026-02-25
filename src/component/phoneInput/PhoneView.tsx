import {
  detectCountryFromPhone,
  COUNTRIES,
  formatPhoneForDisplay,
} from "../../utils/phone";

const PhoneView = ({ phone }: { phone?: string }) => {
  if (!phone) return null;

  const country = detectCountryFromPhone(phone);
  const dial = COUNTRIES.find((c) => c.code === country)?.dial;
  const local = formatPhoneForDisplay(phone);

  return (
    <div className="flex h-[38px] rounded-md border  bg-[#F1F1F1] text-black">
      <div className="px-3 text-sm flex items-center text-black">{dial}</div>

      <div className="w-px bg-[#E6E6E6]" />

      <div className="flex-1 px-3 text-sm flex items-center text-gray-900">
        {local}
      </div>
    </div>
  );
};

export default PhoneView;
