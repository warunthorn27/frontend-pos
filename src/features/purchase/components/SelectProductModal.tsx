import { useEffect, useState } from "react";
import type { Product } from "../../../types/purchase";
import CloseIcon from "../../../assets/svg/remove.svg?react";
import SearchIcon from "../../../assets/svg/search.svg?react";
import Checkbox from "../../../component/ui/Checkbox";
import MasterSelect from "../../../component/masterData/MasterSelect";
import { fetchProducts } from "../../../services/product";
import ProductImage from "../../products/product-list/components/ProductImage";
import { mapBackendProduct } from "../../../component/mappers/purchaseMapper";
import { CATEGORY_OPTIONS, getCategoryLabel } from "../../../utils/categoryOptions";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: Product[]) => void;
  selectIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
};

const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="px-8 flex-1 flex flex-col overflow-hidden">
    <div className="rounded-lg border bg-white flex flex-col flex-1 overflow-hidden">
      {children}
    </div>
  </div>
);

const TableHeadCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th
    className={`px-4 py-3 text-left text-base font-normal bg-[#F7F7F7] text-black ${className}`}
  >
    {children}
  </th>
);
const TableCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td
    className={`px-4 py-3 text-sm text-left font-light text-black ${className}`}
  >
    {children}
  </td>
);

const TableRow = ({
  children,
  selected,
}: {
  children: React.ReactNode;
  selected?: boolean;
}) => (
  <tr
    className={`
      border-b border-gray-200
      hover:bg-[#FAFAFA]
      ${selected ? "bg-[#f9fbff]" : ""}
      last:border-b-0
    `}
  >
    {children}
  </tr>
);

const TableFooter = ({
  selectedCount,
  total,
}: {
  selectedCount: number;
  total: number;
}) => {
  const isAllSelected = total > 0 && selectedCount === total;

  let label = "";

  if (selectedCount === 0) {
    label = "No items selected";
  } else if (isAllSelected) {
    label = "All items selected";
  } else {
    label = `${selectedCount} item${selectedCount > 1 ? "s" : ""} selected`;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
      <div className="text-[14px] font-light text-black">{label}</div>
    </div>
  );
};

export default function SelectProductModal({
  open,
  onClose,
  onConfirm,
  selectIds = [],
  onSelectionChange,
}: Props) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  /** ================= SELECT LOGIC ================= */

  const allIds = productList.map((p) => p.id);

  const isAllSelected =
    productList.length > 0 && selectIds.length === productList.length;

  const isIndeterminate =
    selectIds.length > 0 && selectIds.length < productList.length;

  const toggleAll = (checked: boolean) => {
    onSelectionChange?.(checked ? allIds : []);
  };

  const toggleOne = (id: string) => {
    if (selectIds.includes(id)) {
      onSelectionChange?.(selectIds.filter((v) => v !== id));
    } else {
      onSelectionChange?.([...selectIds, id]);
    }
  };

  const display = (value?: string | null) =>
    value && value.trim() !== "" ? value : "-";

  /** ================= CATEGORY OPTIONS ================= */

  const categoryOptions = CATEGORY_OPTIONS;

  /** ================= FETCH ================= */

  useEffect(() => {
    if (!open) return;

    const loadProducts = async () => {
      try {
        setLoading(true);

        const res = await fetchProducts({
          limit: 9999,
          search: search || undefined,
          category: categories.length > 0 ? categories.join(",") : undefined,
        });

        setProductList(res.data.map(mapBackendProduct));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [open, search, categories]);

  const handleConfirm = () => {
    const selected = productList.filter((p) => selectIds.includes(p.id));
    onConfirm(selected);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[95vw] max-w-[1200px] max-h-[90vh] bg-white rounded-lg shadow-lg flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <h2 className="text-xl font-normal">Product</h2>
          <button onClick={onClose}>
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-4 px-8 md:px-8 py-5">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-[400px] h-[38px] rounded-md border border-[#CFCFCF] bg-white px-[20px] text-sm font-light outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B94A3]">
              <SearchIcon className="w-5 h-5" />
            </span>
          </div>

          <MasterSelect
            values={categories}
            options={categoryOptions}
            onChange={setCategories}
          />
        </div>

        {/* TABLE */}
        <TableContainer>
          <div className="max-h-[50vh] overflow-y-auto hide-scrollbar">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_rgba(229,231,235,1)]">
                <tr>
                  <TableHeadCell className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={toggleAll}
                    />
                  </TableHeadCell>
                  <TableHeadCell>#</TableHeadCell>
                  <TableHeadCell>Image</TableHeadCell>
                  <TableHeadCell>Code</TableHeadCell>
                  <TableHeadCell>Product Name</TableHeadCell>
                  <TableHeadCell>Category</TableHeadCell>
                  <TableHeadCell>Type / Stone</TableHeadCell>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-[14px] font-light text-black"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : (
                  productList.map((p, index) => {
                    const selected = selectIds.includes(p.id);

                    return (
                      <TableRow key={p.id} selected={selected}>
                        <TableCell>
                          <Checkbox
                            checked={selected}
                            onChange={() => toggleOne(p.id)}
                          />
                        </TableCell>

                        <TableCell>{index + 1}</TableCell>

                        <TableCell>
                          <ProductImage
                            imageUrl={p.imageUrl ?? null}
                            alt={p.productName}
                          />
                        </TableCell>

                        <TableCell>
                          <span className="block max-w-[120px] truncate">
                            {display(p.code)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="block max-w-[280px] truncate">
                            {display(p.productName)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="block max-w-[140px] truncate">
                            {display(getCategoryLabel(p.category))}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="block max-w-[200px] truncate">
                            {display(p.typeOrStoneName)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <TableFooter
            selectedCount={selectIds.length}
            total={productList.length}
          />
        </TableContainer>

        {/* Confirm button */}
        <div className="flex justify-end px-8 py-4">
          <button
            onClick={handleConfirm}
            className="px-5 py-2 bg-[#024C8A] text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
