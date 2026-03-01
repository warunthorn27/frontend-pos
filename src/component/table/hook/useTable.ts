import { useState } from "react";

export function useTable<T>(initialData: T[]) {
  const [data, setData] = useState(initialData);

  return {
    data,
    setData,
  };
}
