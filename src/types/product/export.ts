export type ExportType = "all" | "category" | "selected";

export interface ExportProductsPayload {
  type: ExportType;
  value?: string | string[];
}
