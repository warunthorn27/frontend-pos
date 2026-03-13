import { useState } from "react";
import type {
  BusinessType,
  CustomerForm,
  CorporationCustomerForm,
  IndividualCustomerForm,
  Address,
} from "../../../types/customer";

const emptyAddress: Address = {
  address: "",
  country: "Thailand",
  province: "",
  district: "",
  subDistrict: "",
  zipcode: "",
};

const createCorporation = (): CorporationCustomerForm => ({
  businessType: "Corporation",
  phone: "",
  email: "",
  note: "",
  companyName: "",
  contactPerson: "",
  address: { ...emptyAddress },
});

const createIndividual = (): IndividualCustomerForm => ({
  businessType: "Individual",
  phone: "",
  email: "",
  note: "",
  firstName: "",
  lastName: "",
  gender: "",
  birthday: "",
  address: { ...emptyAddress },
});

export const useAddCustomerForm = () => {
  const [businessType, setBusinessType] = useState<BusinessType>("Corporation");

  const [form, setForm] = useState<CustomerForm>(createCorporation());

  const [showTaxInvoice, setShowTaxInvoice] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(false);

  const [taxInvoiceForm, setTaxInvoiceForm] = useState({
    companyName: "",
    taxId: "",
    address: { ...emptyAddress },
  });

  const switchType = (type: BusinessType) => {
    setBusinessType(type);

    setForm(type === "Corporation" ? createCorporation() : createIndividual());

    setShowTaxInvoice(false);
    setUseSameAddress(false);

    setTaxInvoiceForm({
      companyName: "",
      taxId: "",
      address: { ...emptyAddress },
    });
  };

  const handleAddTaxInvoice = () => {
    setShowTaxInvoice(true);
  };

  const handleRemoveTaxInvoice = () => {
    setShowTaxInvoice(false);
    setUseSameAddress(false);
  };

  const handleToggleSameAddress = (checked: boolean) => {
    setUseSameAddress(checked);

    if (checked) {
      setTaxInvoiceForm((prev) => ({
        ...prev,
        address: { ...form.address },
        companyName:
          form.businessType === "Corporation"
            ? form.companyName
            : prev.companyName,
      }));
    }
  };

  return {
    businessType,
    form,
    setForm,
    switchType,

    showTaxInvoice,
    useSameAddress,
    taxInvoiceForm,

    setTaxInvoiceForm,
    handleAddTaxInvoice,
    handleRemoveTaxInvoice,
    handleToggleSameAddress,
  };
};
