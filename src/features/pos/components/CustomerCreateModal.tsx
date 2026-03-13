import React, { useState } from "react";
import type { CountryCode } from "../../../component/phoneInput/CountryPhoneInput";
import { customerService } from "../../../services/customer";
import type { CustomerForm } from "../../../types/customer";
import AddCustomerFrontOffice from "./AddCustomerFrontOffice";

interface CustomerCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (customerId: string) => void;
}

const CustomerCreateModal: React.FC<CustomerCreateModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [country, setCountry] = useState<CountryCode>("TH");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (values: CustomerForm) => {
    try {
      setLoading(true);

      const res = await customerService.createCustomer(values, country);

      if (res.success && res.data) {
        onSuccess(res.data._id);
      }
    } catch (err) {
      console.error("Failed to create customer:", err);
      alert("Failed to create customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal content */}
      <div className="relative w-[95%] max-w-[1100px] max-h-[90vh] rounded-md overflow-hidden">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center">
            <div className="animate-pulse text-lg text-gray-600">
              Creating customer...
            </div>
          </div>
        )}

        <AddCustomerFrontOffice
          country={country}
          onCountryChange={setCountry}
          onCancel={onClose}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};

export default CustomerCreateModal;
