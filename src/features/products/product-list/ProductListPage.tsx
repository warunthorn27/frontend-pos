import React, { useCallback, useEffect, useState } from "react";
import ProductFilters from "../product-list/components/ProductFilters";
import {
  deleteProduct,
  exportProductsToExcel,
  fetchProducts,
  updateProductStatus,
} from "../../../services/product";
import { CATEGORY_OPTIONS } from "../../../utils/categoryOptions";
import {
  PRODUCT_CATEGORY_LABEL,
  type ProductRow,
} from "../../../types/product/transform";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import ConfirmDeleteDialog from "../../../component/dialog/ConfirmDeleteDialog";
import type { ProductListItem } from "../../../types/product/response";
import { normalizeCategoryFromList } from "../../../component/mappers/resolveProductForm";
import type { ExportProductsPayload } from "../../../types/product/export";
import ProductExportDropdown from "../../../component/ui/ProductExportDropdown";

const ProductListPage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [rowsPerPage] = useState<number>(10);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [openProductModal, setOpenProductModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const handleRowClick = (id: string) => {
    setSelectedProductId(id);
    setModalMode("view");
    setOpenProductModal(true);
  };

  const handleMainExportClick = () => {
    // PRIORITY สูงสุด
    if (selectedProductIds.length > 0) {
      handleProductExportFromUI(); // ไม่ส่ง category >> backend จะ export selected
      return;
    }

    // ไม่มี selection >> เปิด dropdown
    toggleExportDropdown();
  };

  const handleProductExportFromUI = useCallback(
    async (categoryIdsFromDropdown?: string | string[]) => {
      try {
        let payload: ExportProductsPayload;

        if (selectedProductIds.length > 0) {
          payload = {
            type: "selected",
            value: selectedProductIds,
          };
        } else if (categoryIdsFromDropdown) {
          payload = {
            type: "category",
            value: categoryIdsFromDropdown,
          };
        } else {
          payload = { type: "all" };
        }

        const fileBlob = await exportProductsToExcel(payload);

        const downloadUrl = window.URL.createObjectURL(fileBlob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `products_${Date.now()}.xlsx`;
        link.click();

        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Product export failed", error);
      }
    },
    [selectedProductIds],
  );

  const handleExportAllProducts = useCallback(() => {
    handleProductExportFromUI();
  }, [handleProductExportFromUI]);

  const handleToggleStatus = async (
    id: string,
    active: boolean,
  ): Promise<void> => {
    try {
      // optimistic update (UI เปลี่ยนทันที)
      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, status: active ? "active" : "inactive" }
            : row,
        ),
      );

      await updateProductStatus(id, active);
    } catch {
      // rollback ถ้า error
      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? {
                ...row,
                status: row.status === "active" ? "inactive" : "active",
              }
            : row,
        ),
      );
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const handleEdit = (id: string) => {
    setSelectedProductId(id);
    setModalMode("edit");
    setOpenProductModal(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProduct(deleteId);
      await fetchProducts(); // refresh table

      setOpenDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const [categoryOptions] = useState(CATEGORY_OPTIONS);
  const [categories, setCategories] = useState<string[]>([]);

  const [openExport, setOpenExport] = useState(false);
  const toggleExportDropdown = () => setOpenExport((prev) => !prev);
  const closeExportDropdown = () => setOpenExport(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchProducts({
        search,
        category: categories.join(","),
      });

      const mapped: ProductRow[] = res.data.map((p: ProductListItem) => {
        const category = normalizeCategoryFromList(p.category);

        return {
          id: p._id,
          imageUrl: p.image,
          code: p.product_code,
          productName: p.product_name,

          category, // logic
          categoryLabel: PRODUCT_CATEGORY_LABEL[category], // display

          typeOrStone: p.type_stone,
          size: p.size,
          metal: p.metal,
          color: p.color,
          status: p.is_active ? "active" : "inactive",
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }, [search, categories]); // dependencies ของฟังก์ชัน

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="w-full h-full">
      {/* top blue bar */}
      <div className="w-full max-w-[1690px] mx-auto flex flex-col min-h-0">
        <h2 className="text-2xl font-normal text-[#06284B] mb-6">
          Product List
        </h2>

        <ProductFilters
          categories={categories}
          categoryOptions={categoryOptions}
          search={search}
          onChangeCategories={setCategories}
          onChangeSearch={setSearch}
          onPrint={() => console.log("print")}
          openExport={openExport}
          onToggleExport={handleMainExportClick}
          onExportAll={handleExportAllProducts}
          exportDropdown={
            <ProductExportDropdown
              onExport={(dropdownPayload) => {
                handleProductExportFromUI(dropdownPayload.value);
                closeExportDropdown();
              }}
              onClose={closeExportDropdown}
            />
          }
        />

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-[6px] border border-[#E7EDF6] bg-white overflow-hidden">
          <ProductTable
            rows={rows.slice(0, rowsPerPage)}
            loading={loading}
            selectIds={selectedProductIds}
            onSelectionChange={setSelectedProductIds}
            onRowClick={handleRowClick}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <ConfirmDeleteDialog
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </div>
      {openProductModal && selectedProductId && (
        <ProductModal
          open={openProductModal}
          productId={selectedProductId}
          mode={modalMode}
          onClose={() => setOpenProductModal(false)}
          onSaved={() => {
            loadProducts(); // รีเฟรชตาราง
          }}
        />
      )}
    </div>
  );
};

export default ProductListPage;
