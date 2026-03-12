import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import AddCustomer from "../../customers/create/AddCustomer";
import type { CountryCode } from "../../../component/phoneInput/CountryPhoneInput";
import { customerService } from "../../../services/customer";
import type { CustomerForm } from "../../../types/customer";

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

  return (
    <Modal open={open} onClose={loading ? undefined : onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "1200px",
          height: "90vh",
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 0,
          outline: "none",
          overflow: "hidden",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(255, 255, 255, 0.7)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="animate-pulse text-lg text-gray-600">Creating customer...</div>
          </Box>
        )}
        <div className="h-full p-6">
          <AddCustomer
            country={country}
            onCountryChange={setCountry}
            onCancel={onClose}
            onConfirm={handleConfirm}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default CustomerCreateModal;
