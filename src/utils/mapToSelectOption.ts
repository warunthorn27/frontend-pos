import type { SelectOption } from "../types/shared/select";

export function mapToSelectOption(
  items: { _id: string; name: string }[]
): SelectOption[] {
  return items.map((i) => ({
    value: i._id,
    label: i.name,
  }));
}
