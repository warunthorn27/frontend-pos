import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { CustomerListItem } from "../../../types/customer";
import EditIcon from "../../../assets/svg/edit.svg?react";
import DeleteIcon from "../../../assets/svg/trash.svg?react";

type Props = {
  data: CustomerListItem[];
  page: number;
  pageSize: number;
  total: number;
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
  loading,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => <div className="pl-4">#</div>,
      renderCell: (params) => <div className="pl-4 w-full">{params.value}</div>,
    },

    { field: "customerId", headerName: "Customer ID", flex: 1.3 },
    { field: "businessType", headerName: "Business Type", flex: 0.8 },
    { field: "companyName", headerName: "Company Name", flex: 1.2 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.2 },
    { field: "phone", headerName: "Phone", flex: 1 },

    {
      field: "actions",
      headerName: "Action",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => (
        <div className="flex items-center justify-center w-full h-full gap-3">
          <button onClick={() => onEdit?.(params.row.id)}>
            <EditIcon className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete?.(params.row.id)}>
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const rows = data.map((c, i) => ({
    ...c,
    index: (page - 1) * pageSize + i + 1,
    actions: "", // กัน warning / error
  }));

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        loading={loading}
        rows={rows}
        columns={columns}
        rowCount={total}
        rowHeight={60}
        paginationMode="server"
        pageSizeOptions={[10, 20, 50]}
        paginationModel={{ page: page - 1, pageSize }}
        onPaginationModelChange={(model) => {
          onPageChange(model.page + 1);
          onPageSizeChange(model.pageSize);
        }}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          fontFamily: "Prompt, sans-serif",

          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #F1F5F9",
          },

          // header
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "18px",
            fontWeight: "normal",
          },

          // content on each cell
          "& .MuiDataGrid-cell": {
            fontSize: "16px",
            fontWeight: "light",
            borderBottom: "1px solid #F8FAFC",
          },

          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #E5E7EB",
          },

          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        }}
      />
    </div>
  );
};

export default CustomerTable;
