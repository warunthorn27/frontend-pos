import { useEffect, useState } from "react";
import FileUploadProgress from "./FileUploadProgress";
import type {
  ImportErrorRow,
  ImportPurchaseItem,
  PurchaseItemRow,
} from "../../../../types/purchase";
import {
  downloadPurchaseTemplate,
  importPurchaseFile,
} from "../../../../services/purchase";
import SelectFileIcon from "../../../../assets/svg/import.svg?react";
import CheckIcon from "../../../../assets/svg/checkFilter.svg?react";
import TrashIcon from "../../../../assets/svg/trash.svg?react";
import UploadIcon from "../../../../assets/svg/file-download.svg?react";
import CloseIcon from "../../../../assets/svg/close.svg?react";

interface Props {
  open: boolean;
  onClose: () => void;
  onImportSuccess: (rows: PurchaseItemRow[]) => void;
}

export default function ImportPurchaseModal({
  open,
  onClose,
  onImportSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [rows, setRows] = useState<ImportPurchaseItem[]>([]);
  const [errorRows, setErrorRows] = useState<ImportErrorRow[]>([]);

  useEffect(() => {
    if (open) {
      setFile(null);
      setProgress(0);
      setUploading(false);
      setComplete(false);
      setRows([]);
      setErrorRows([]);
    }
  }, [open]);

  if (!open) return null;

  /* ================= FILE SELECT ================= */

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setUploading(true);
    setComplete(false);

    try {
      const result = await importPurchaseFile(f, setProgress);

      const validRows: ImportPurchaseItem[] = result.data.map((r) => ({
        ...r,
        isError: false,
      }));

      const errorMapped: ImportPurchaseItem[] = result.errorData.map((r) => ({
        product_id: "",
        code: r.Code ?? "",
        name: r.Name ?? "",
        quantity: r.QTY ?? 0,
        unit: "pcs",
        isError: true,
        errorReason: r.Error_Reason,
      }));

      setRows([...validRows, ...errorMapped]);
      setErrorRows(result.errorData);
      setComplete(true);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE FILE ================= */

  const handleDelete = () => {
    setFile(null);
    setProgress(0);
    setComplete(false);
    setRows([]);
    setErrorRows([]);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    const validRows = rows.filter((r) => !r.isError);

    // ถ้าไม่มี match เลย
    if (validRows.length === 0) {
      onImportSuccess([]);
      onClose();
      return;
    }

    const mappedRows: PurchaseItemRow[] = rows.map((r) => {
      const stoneWeight = r.stone_weight ?? 0;
      const netWeight = r.net_weight ?? 0;
      const grossWeight = r.gross_weight ?? 0;

      const qty = r.quantity ?? 0;
      const cost = r.cost ?? 0;
      const unit = r.unit ?? "pcs";

      const amount = unit === "g" ? grossWeight * cost : qty * cost;

      return {
        productId: r.product_id,
        code: r.code,
        name: r.name,
        imageUrl: r.image,

        category: "others",

        stoneWeight: stoneWeight.toFixed(2),
        stoneUnit: "g",

        netWeight: netWeight.toFixed(2),
        grossWeight: grossWeight.toFixed(2),

        quantity: qty,
        unit,

        cost,
        amount,
        price: r.price ?? 0,

        isError: r.isError ?? false,
        errorReason: r.errorReason,
      };
    });

    onImportSuccess(mappedRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-lg shadow-lg">
        {/* HEADER */}

        <div className="flex justify-between items-center px-4 py-3 border-b border-[#E6E6E6]">
          <h2 className="text-lg font-normal">Import</h2>

          <button
            onClick={() => {
              setFile(null);
              setProgress(0);
              setComplete(false);
              setRows([]);
              setErrorRows([]);
              onClose();
            }}
            className="text-gray-500 hover:text-black"
          >
            <CloseIcon className="w-7 h-7 text-black" />
          </button>
        </div>

        <div className="p-6 space-y-4 bg-[#FBFBFB]">
          {/* ================= SELECT FILE ================= */}

          {!file && (
            <>
              <div className="border border-[#E6E6E6] bg-white rounded-lg p-10 text-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFile}
                  className="hidden"
                  id="fileUpload"
                />

                <label
                  htmlFor="fileUpload"
                  className="inline-flex items-center gap-3 cursor-pointer px-4 py-2 bg-white border border-[#CFCFCF] rounded-md hover:bg-[#F1F1F1] font-normal text-base text-[#2A2A2A]"
                >
                  <SelectFileIcon className="w-5.5 h-5.5 text-[#2A2A2A]" />
                  Select File
                </label>

                <p className="text-sm text-gray-600 mt-6 font-light">
                  Upload .xlsx, .xls or .csv file
                </p>
              </div>

              {/* DOWNLOAD EXAMPLE */}

              <button
                type="button"
                onClick={async () => {
                  try {
                    const blob = await downloadPurchaseTemplate();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "purchase_template.xlsx");
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("Download template failed:", err);
                    // Optionally add error toast here
                  }
                }}
                className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md hover:bg-[#F1F1F1] font-normal text-base text-[#2A2A2A]"
              >
                Download example file
              </button>
            </>
          )}

          {/* ================= FILE SELECTED ================= */}

          {file && (
            <>
              <div className="bg-white border border-[#E6E6E6] rounded-lg p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-md flex items-center justify-center">
                  <UploadIcon className="w-10 h-10 text-black" />
                </div>

                <div className="flex-1">
                  <div className="text-sm font-normal">{file.name}</div>

                  {/* uploading */}
                  {uploading && <FileUploadProgress progress={progress} />}

                  {/* complete */}
                  {complete && errorRows.length === 0 && (
                    <div className="flex items-center gap-2 text-[#34C759] text-sm font-light mt-1">
                      <CheckIcon className="w-4 h-4 text-[#34C759]" />
                      Complete.
                    </div>
                  )}

                  {/* error rows */}
                  {complete && errorRows.length > 0 && (
                    <div className="flex items-center gap-1 text-[#E71010] text-sm font-light mt-1">
                      <CloseIcon className="w-6 h-6" />
                      This file contains error rows.
                    </div>
                  )}
                </div>

                <button onClick={handleDelete}>
                  <TrashIcon className="w-5 h-5 text-[#E71010]" />
                </button>
              </div>
            </>
          )}

          {/* ================= SUBMIT BUTTON ================= */}

          {file && (
            <div className="flex justify-end pt-14">
              <button
                disabled={!complete}
                onClick={handleSubmit}
                className={`px-4 py-2 rounded-md text-white
                  ${complete
                    ? "bg-[#005AA7] hover:bg-[#084072]"
                    : "bg-gray-300 cursor-not-allowed"
                  }
                `}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
