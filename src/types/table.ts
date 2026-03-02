import React from "react";

export type SortDirection = "asc" | "desc";

export type Column<T> = {
  key: keyof T;
  header: React.ReactNode;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  filterOptions?: {
    label: string;
    value: string | number;
  }[];
};

export type PaginationConfig = {
  page: number;
  pageSize: number;
  total: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};
