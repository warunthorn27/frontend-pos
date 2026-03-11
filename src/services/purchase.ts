import type {
  CreatePurchasePayload,
  ImportPurchaseResponse,
} from "../types/purchase";
import { API_BASE, getAuthHeaders } from "./apiClient";

export async function getNextPurchaseNumber(): Promise<string> {
  const res = await fetch(`${API_BASE}/purchase/next-number`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Failed to get purchase number");
  }

  return json.data;
}

export async function createPurchase(
  payload: CreatePurchasePayload,
): Promise<void> {
  const res = await fetch(`${API_BASE}/purchase/create`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Create purchase failed");
  }
}

// import file
export function importPurchaseFile(
  file: File,
  onProgress: (progress: number) => void,
): Promise<ImportPurchaseResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_BASE}/purchase/import-preview`);

    const headers = getAuthHeaders();

    if (headers.Authorization) {
      xhr.setRequestHeader("Authorization", headers.Authorization);
    }

    xhr.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      const response: ImportPurchaseResponse = JSON.parse(xhr.responseText);

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(response);
      } else {
        reject(new Error("Import failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    const formData = new FormData();
    formData.append("file", file);

    xhr.send(formData);
  });
}

export async function downloadPurchaseTemplate(): Promise<Blob> {
  const res = await fetch(`${API_BASE}/purchase/download-template`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    let errorMessage = "Failed to download template";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  return await res.blob();
}
