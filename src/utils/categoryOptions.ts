export const CATEGORY_OPTIONS = [
  { value: "productmaster", label: "Product Master" },
  { value: "stone", label: "Stone / Diamond" },
  { value: "semimount", label: "Semi-Mount" },
  { value: "accessory", label: "Accessories" },
  { value: "others", label: "Others" },
];

export function getCategoryLabel(value?: string): string {
  if (!value) return "";

  const found = CATEGORY_OPTIONS.find(
    (c) => c.value.toLowerCase() === value.toLowerCase(),
  );

  return found?.label ?? value;
}

export function getCategoryValue(label?: string): string {
  if (!label) return "";

  const found = CATEGORY_OPTIONS.find(
    (c) => c.label.toLowerCase() === label.toLowerCase(),
  );

  return found?.value ?? label;
}
