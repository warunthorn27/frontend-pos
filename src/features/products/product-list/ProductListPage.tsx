import React, { useMemo, useState } from "react";
import ProductFilters from "../product-list/components/ProductFilters";
import ProductTable, {
  type ProductRow,
} from "../product-list/components/ProductTable";

const mockRows: ProductRow[] = [
  {
    id: "1",
    image: "necklace",
    code: "PD-1001",
    productName: "Diamond Pendant",
    category: "Product Master",
    typeOrStone: "Pendant",
    size: "18 mm",
    metal: "18K WG",
    color: "White Gold",
    status: "active",
  },
  {
    id: "2",
    image: "diamond",
    code: "DIM-1001",
    productName: "Diamond",
    category: "Stone / Diamond",
    typeOrStone: "Diamond",
    size: "0.65 ct",
    metal: "",
    color: "White",
    status: "active",
  },
  {
    id: "3",
    image: "ring",
    code: "RG-1001",
    productName: "Ring",
    category: "Semi-Mount",
    typeOrStone: "Ring",
    size: "M",
    metal: "18K WG",
    color: "White Gold",
    status: "inactive",
  },
  {
    id: "4",
    image: "teddy",
    code: "TB-1001",
    productName: "Teddy Bear",
    category: "Others",
    typeOrStone: "",
    size: "10 cm",
    metal: "",
    color: "",
    status: "active",
  },
  {
    id: "5",
    image: "chain",
    code: "CHN-1001",
    productName: "Chain Necklace",
    category: "Accessories",
    typeOrStone: "",
    size: "10 cm",
    metal: "Sliver",
    color: "",
    status: "inactive",
  },
];

const ProductListPage: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [itemType, setItemType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [rowsPerPage] = useState<number>(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockRows.filter((r) => {
      const matchCategory = !category || r.category === category;
      const matchItemType = !itemType || r.typeOrStone === itemType;
      const matchSearch =
        !q ||
        r.code.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.typeOrStone.toLowerCase().includes(q);
      return matchCategory && matchItemType && matchSearch;
    });
  }, [category, itemType, search]);

  return (
    <div className="w-full h-full">
      {/* top blue bar */}
      <div className="w-full max-w-[1690px] mx-auto flex flex-col min-h-0">
        <h2 className="text-2xl font-normal text-[#06284B] mb-6">
          Product List
        </h2>

        <ProductFilters
          category={category}
          itemType={itemType}
          search={search}
          onChangeCategory={setCategory}
          onChangeItemType={setItemType}
          onChangeSearch={setSearch}
          onPrint={() => console.log("print")}
          onExportExcel={() => console.log("export excel")}
        />

        <div className="mt-6 rounded-[6px] border border-[#E7EDF6] bg-white overflow-hidden">
          <ProductTable
            rows={filtered.slice(0, rowsPerPage)}
            onEdit={(id) => console.log("edit", id)}
            onDelete={(id) => console.log("delete", id)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
