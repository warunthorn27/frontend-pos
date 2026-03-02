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
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [openProductModal, setOpenProductModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [categoryOptions] = useState(CATEGORY_OPTIONS);
  const [categories, setCategories] = useState<string[]>([]);

  const [openExport, setOpenExport] = useState(false);

  /* ========================
     Pagination (API Based)
  ========================= */

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  /* ========================
     Handlers
  ========================= */

  const handleRowClick = (id: string) => {
    setSelectedProductId(id);
    setModalMode("view");
    setOpenProductModal(true);
  };

  const toggleExportDropdown = () => setOpenExport((prev) => !prev);
  const closeExportDropdown = () => setOpenExport(false);

  const handleMainExportClick = () => {
    if (selectedProductIds.length > 0) {
      handleProductExportFromUI();
      return;
    }
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

  const handleToggleStatus = async (id: string, active: boolean) => {
    try {
      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, status: active ? "active" : "inactive" }
            : row,
        ),
      );

      await updateProductStatus(id, active);
    } catch {
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
      loadProducts();
      setOpenDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ========================
     Load Products (API Pagination)
  ========================= */

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchProducts({
        page,
        limit: pageSize,
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
          category,
          categoryLabel: PRODUCT_CATEGORY_LABEL[category],
          typeOrStone: p.type_stone,
          size: p.size,
          metal: p.metal,
          color: p.color,
          status: p.is_active ? "active" : "inactive",
        };
      });

      setRows(mapped);
      setTotal(res.total_record);
      setTotalPages(res.total_page);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }, [search, categories, page, pageSize]);

  /* Reload when page / size / filter changes */
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* ========================
     Render
  ========================= */

  return (
    <div className="w-full h-full">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col min-h-0">
        <h2 className="text-2xl font-normal text-[#06284B] mb-6">
          Product List
        </h2>

        <ProductFilters
          categories={categories}
          categoryOptions={categoryOptions}
          search={search}
          onChangeCategories={(value) => {
            setCategories(value);
            setPage(1);
          }}
          onChangeSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
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

        <div className="mt-6 rounded-md border bg-white overflow-hidden shadow-sm">
          <ProductTable
            rows={rows}
            loading={loading}
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
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
          onSaved={loadProducts}
        />
      )}
    </div>
  );
};

export default ProductListPage;
