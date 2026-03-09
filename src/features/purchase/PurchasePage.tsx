import { useEffect, useState } from "react";
import PurchaseInfoCard from "./components/PurchaseInfoCard";
import PurchaseItemsTable from "./components/PurchaseItemsTable";
import { getCompanyId as getPersistedCompanyId } from "../../utils/authStorage";
import { getCompanyById } from "../../services/company";
import { mapCompanyApiToForm } from "../../component/mappers/companyMapper";
import { createPurchase, getNextPurchaseNumber } from "../../services/purchase";
import { getExchangeRate } from "../../services/exchangeRate";
import type { PurchaseItemRow } from "../../types/purchase";
import { useInventorySuccessToast } from "../../component/ui/toast/inventory-success-toast/hook";
// import { useNavigate } from "react-router-dom";

type PurchaseErrors = {
  date?: string;
  vendor?: string;
  currency?: string;
  exchangeRate?: string;
  items?: string;
};

export default function PurchasePage() {
  // const navigate = useNavigate();
  const [companyCurrency, setCompanyCurrency] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [purchaseNumber, setPurchaseNumber] = useState<string>("");
  const getToday = () => new Date().toISOString().slice(0, 10);

  const [items, setItems] = useState<PurchaseItemRow[]>([]);
  const [date, setDate] = useState<string>(getToday());
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [vendor, setVendor] = useState("");
  const [ref1, setRef1] = useState("");
  const [ref2, setRef2] = useState("");
  const [note, setNote] = useState("");

  const { showInventorySuccessToast } = useInventorySuccessToast();

  const isSaveDisabled =
    !date || !vendor || !currency || exchangeRate <= 0 || items.length === 0;

  // ================= RESET FORM =================
  const resetForm = async () => {
    setItems([]);
    setVendor("");
    setDate(getToday());
    setRef1("");
    setRef2("");
    setNote("");

    // reset currency กลับค่า default company
    setCurrency(companyCurrency);

    // setDate(new Date().toISOString().slice(0, 10));

    const nextNumber = await getNextPurchaseNumber();
    setPurchaseNumber(nextNumber);
  };

  const validateForm = () => {
    const newErrors: PurchaseErrors = {};

    if (!date) {
      newErrors.date = "Date is required";
    }

    if (!vendor.trim()) {
      newErrors.vendor = "Vendor is required";
    }

    if (!currency) {
      newErrors.currency = "Currency is required";
    }

    if (!exchangeRate || exchangeRate <= 0) {
      newErrors.exchangeRate = "Exchange rate must be greater than 0";
    }

    if (items.length === 0) {
      newErrors.items = "Please add at least 1 product";
    }

    return Object.keys(newErrors).length === 0;
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      if (!validateForm()) return;

      const payload = {
        date,
        vendor_name: vendor,
        currency,
        manual_rate: exchangeRate,

        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit: item.unit,
          stone_weight: Number(item.stoneWeight || 0),
          net_weight: Number(item.netWeight || 0),
          gross_weight: Number(item.grossWeight || 0),
          cost: item.cost,
          price: item.price,
        })),
      };

      await createPurchase(payload);

      showInventorySuccessToast(items.length);

      await resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadInitData = async () => {
      try {
        const companyId = getPersistedCompanyId();
        if (!companyId) return;

        // โหลดพร้อมกัน
        const [companyApi, nextNumber] = await Promise.all([
          getCompanyById(companyId),
          getNextPurchaseNumber(),
        ]);

        const mapped = mapCompanyApiToForm(companyApi);

        setCompanyCurrency(mapped.currency); // เก็บค่า base currency
        setCurrency(mapped.currency); // ตั้ง default ให้ purchase
        setPurchaseNumber(nextNumber);
      } catch (err) {
        console.error("Load purchase page failed", err);
      }
    };

    loadInitData();
  }, []);

  // exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        if (!currency || !date) return;

        const result = await getExchangeRate(currency, date);

        setExchangeRate(result.rate);
        // setCompanyCurrency(result.base_currency);
      } catch (err) {
        console.error("Fetch rate failed", err);
      }
    };

    fetchRate();
  }, [currency, date]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* TITLE */}
      <h1 className="text-2xl font-normal text-[#084072] mb-6">Purchase</h1>

      {/* CONTAINER SCROLL */}
      <div className="flex-1 min-h-0 rounded-md bg-gray-50 shadow-md flex flex-col overflow-hidden">
        {/* Card Wrapper */}
        <div className="w-full flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="bg-[#FAFAFA] rounded-t-md rounded-b-none shadow-md flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* SCROLLABLE CONTENT AREA */}
            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-8 pt-6 pb-8 border-b">
              <div className="max-w-[1600px] space-y-8">
                <PurchaseInfoCard
                  purchaseNumber={purchaseNumber}
                  currency={currency}
                  date={date}
                  exchangeRate={exchangeRate}
                  vendor={vendor}
                  ref1={ref1}
                  ref2={ref2}
                  onVendorChange={setVendor}
                  onRef1Change={setRef1}
                  onRef2Change={setRef2}
                  onDateChange={setDate}
                  onCurrencyChange={setCurrency}
                  onExchangeRateChange={setExchangeRate}
                  companyCurrency={companyCurrency}
                />

                <PurchaseItemsTable items={items} setItems={setItems} />

                <div className="max-w-xl">
                  <label className="block text-base font-normal mb-2">
                    Note
                  </label>
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm border-[#CFCFCF] focus:outline-none focus:border-[#005AA7]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="py-4 border-[#E6E6E6] flex justify-center gap-4 bg-[#FAFAFA] rounded-b-lg">
          <button className="w-24 px-4 py-[6px] bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md">
            Cancel
          </button>

          <button
            disabled={isSaveDisabled}
            onClick={handleSave}
            className={`
              w-24 px-4 py-[6px] text-base rounded-md
              ${
                isSaveDisabled
                  ? "bg-[#BABABA] text-[#6B6B6B] cursor-not-allowed"
                  : "bg-[#005AA7] hover:bg-[#084072] text-white"
              }
            `}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
