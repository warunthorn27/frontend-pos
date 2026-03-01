import React from "react";
import DataTable from "../../../component/table/DataTable";
import type { Column } from "../../../types/table";
import type { CustomerListItem } from "../../../types/customer";
import ActionButtons from "../../../component/ui/ActionButtons";

type Props = {
  data: CustomerListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRowClick?: (id: string) => void;
};

const CustomerTable: React.FC<Props> = ({
  data,
  page,
  pageSize,
  total,
  totalPages,
  startIndex,
  endIndex,
  loading,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const columns: Column<CustomerListItem>[] = [
    {
      key: "index",
      header: "#",
      width: "80px",
    },
    {
      key: "customerId",
      header: "Customer ID",
      width: "170px",
    },
    {
      key: "businessType",
      header: "Business Type",
      width: "220px",
    },
    {
      key: "companyName",
      header: "Company Name",
      width: "270px",
    },
    {
      key: "name",
      header: "Name",
      width: "280px",
    },
    {
      key: "email",
      header: "Email",
      width: "250px",
    },
    {
      key: "phone",
      header: "Phone",
      width: "180px",
    },
    {
      key: "id",
      header: "Action",
      width: "150px",
      render: (_, row) => (
        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()} // กัน row click
        >
          <ActionButtons id={row.id} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ];

  const rows: CustomerListItem[] = data.map((c, i) => ({
    ...c,
    index: (page - 1) * pageSize + i + 1,
  }));

  if (loading) {
    return <div className="p-6 text-gray-400">Loading...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={rows}
      page={page}
      pageSize={pageSize}
      total={total}
      totalPages={totalPages}
      startIndex={startIndex}
      endIndex={endIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={(row) => onRowClick?.(row.id)}
    />
  );
};

export default CustomerTable;
