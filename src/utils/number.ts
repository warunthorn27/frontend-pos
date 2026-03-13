export const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return "0.00";

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatMoneyWithCurrency = (
  value?: number,
  currency: string = "THB",
) => {
  if (value === undefined || value === null) return "0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};
