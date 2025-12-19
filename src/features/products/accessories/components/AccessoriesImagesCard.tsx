import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import UploadImage from "../../../../assets/svg/upload-image.svg?react";
import ZoomoutIcon from "../../../../assets/svg/zoom-out.svg?react";
import TrashIcon from "../../../../assets/svg/trash.svg?react";

type Props = {
  max?: number;
  value: File[];
  onChange: (files: File[]) => void;

  /** key => progress (0-100) */
  uploadProgress?: Record<string, number>;
};

type PreviewItem = {
  id: string;
  key: string;
  file: File;
  url: string;
};

function isAllowedImage(file: File) {
  const okTypes = ["image/jpeg", "image/png", "image/jpg"];
  return okTypes.includes(file.type);
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function shallowEqual(a: Record<string, string>, b: Record<string, string>) {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
}

export default function AccessoriesImagesCard({
  max = 9,
  value,
  onChange,
  uploadProgress,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // keep latest value in ref to avoid stale closure in addFiles (rapid drops/changes)
  const valueRef = useRef<File[]>(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // render-friendly state
  const [urlByKey, setUrlByKey] = useState<Record<string, string>>({});
  // ref for cleanup + computing next map (don't read in render)
  const urlByKeyRef = useRef<Record<string, string>>({});

  // keep ref in sync (outside render)
  useEffect(() => {
    urlByKeyRef.current = urlByKey;
  }, [urlByKey]);

  // create/revoke objectURLs when `value` changes
  // and avoid "setState synchronously in effect" warning by scheduling setState
  useEffect(() => {
    const prev = urlByKeyRef.current;
    const next: Record<string, string> = { ...prev };
    const keysNow = new Set(value.map(fileKey));

    // revoke removed
    for (const k of Object.keys(next)) {
      if (!keysNow.has(k)) {
        URL.revokeObjectURL(next[k]);
        delete next[k];
      }
    }

    // create missing
    for (const f of value) {
      const k = fileKey(f);
      if (!next[k]) next[k] = URL.createObjectURL(f);
    }

    if (shallowEqual(prev, next)) return;

    // update ref first
    urlByKeyRef.current = next;

    // schedule state update (avoid synchronous setState in effect body)
    const t = window.setTimeout(() => {
      setUrlByKey(next);
    }, 0);

    return () => window.clearTimeout(t);
  }, [value]);

  // cleanup all on unmount
  useEffect(() => {
    return () => {
      const all = urlByKeyRef.current;
      for (const url of Object.values(all)) URL.revokeObjectURL(url);
      urlByKeyRef.current = {};
    };
  }, []);

  const previews: PreviewItem[] = useMemo(() => {
    return value.slice(0, max).map((file) => {
      const key = fileKey(file);
      return {
        id: key,
        key,
        file,
        url: urlByKey[key] ?? "",
      };
    });
  }, [value, urlByKey, max]);

  const remaining = useMemo(
    () => Math.max(0, max - value.length),
    [max, value.length]
  );
  const canAddMore = remaining > 0;

  // defensive clamp: if parent passes more than max for any reason, cut down once
  useEffect(() => {
    if (value.length > max) {
      const next = value.slice(0, max);
      valueRef.current = next; // sync ref immediately
      onChange(next);
    }
  }, [max, onChange, value]);

  const pickFiles = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const current = valueRef.current;

      // ถ้าเต็มแล้ว ไม่ต้องทำอะไร
      const remainingNow = Math.max(0, max - current.length);
      if (remainingNow <= 0) return;

      const arr = Array.from(files).filter(isAllowedImage);
      if (arr.length === 0) return;

      const next = [...current, ...arr].slice(0, max);

      // sync ref immediately to avoid race when user drops/selects again quickly
      valueRef.current = next;
      onChange(next);
    },
    [max, onChange]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      addFiles(files);
      e.target.value = "";
    },
    [addFiles]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!e.dataTransfer.files) return;
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // viewing key (safe)
  const [viewingKey, setViewingKey] = useState<string | null>(null);
  const viewing = useMemo(
    () => previews.find((p) => p.key === viewingKey) ?? null,
    [previews, viewingKey]
  );
  const closeView = useCallback(() => setViewingKey(null), []);

  useEffect(() => {
    if (!viewing) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeView();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeView, viewing]);

  const removeAll = useCallback(() => {
    closeView();
    valueRef.current = []; // sync ref immediately
    onChange([]);
  }, [closeView, onChange]);

  const removeAt = useCallback(
    (index: number) => {
      closeView();
      const next = value.filter((_, i) => i !== index);
      valueRef.current = next; // sync ref immediately
      onChange(next);
    },
    [closeView, onChange, value]
  );

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        className="w-full h-[142px] rounded-[10px] border-2 border-dashed border-[#B6DEFF] bg-[#F7FBFF]
                   flex flex-col items-center justify-center text-[#525252]"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <UploadImage className="w-[34px] h-[34px] mb-[10px]" />

        <p className="text-xs text-center leading-6">
          <span
            className="text-[#2DA9FF] cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={pickFiles}
            onKeyDown={(e) => (e.key === "Enter" ? pickFiles() : undefined)}
          >
            Click to upload
          </span>{" "}
          <span className="text-[#525252]">or drag and drop</span>
          <br />
          <span className="text-[#545454] font-l">
            JPG, JPEG, PNG (Max 1200x1200 px)
          </span>
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple
          onChange={onInputChange}
          className="hidden"
          disabled={!canAddMore}
        />
      </div>

      {/* Header under dropzone */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-[#545454]">{`Max (${Math.min(
          value.length,
          max
        )}/${max})`}</span>

        <button
          type="button"
          onClick={removeAll}
          className="text-[#FF383C] cursor-pointer"
          disabled={value.length === 0}
        >
          Remove all
        </button>
      </div>

      {/* Preview grid 3x3 */}
      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-3">
          {previews.map((p, index) => {
            const raw = uploadProgress?.[p.key];
            const progress =
              typeof raw === "number" ? Math.min(100, Math.max(0, raw)) : null;

            const isUploading = progress !== null && progress < 100;

            return (
              <div
                key={`${p.id}-${index}`} // prevent duplicate-key rendering bugs
                className="group relative aspect-square rounded-md bg-[#F3F3F3] overflow-hidden"
                title={p.file.name}
              >
                {p.url ? (
                  <img
                    src={p.url}
                    alt={p.file.name}
                    className={[
                      "w-full h-full object-cover",
                      isUploading ? "blur-[1.5px] scale-[1.03]" : "",
                    ].join(" ")}
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#7A7A7A]">
                    Loading...
                  </div>
                )}

                {/* Uploading overlay */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[78%] text-center">
                      <p className="text-white text-sm font-medium mb-3">
                        Uploading
                      </p>

                      <div className="w-full h-[6px] rounded-full bg-white/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#46D36B] transition-[width] duration-200 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover overlay + slide-up icons */}
                {!isUploading && (
                  <div
                    className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100
                               transition-opacity duration-200 ease-out
                               flex items-center justify-center"
                  >
                    <div
                      className="flex items-center gap-2
                                 translate-y-6 opacity-0
                                 group-hover:translate-y-0 group-hover:opacity-100
                                 transition-all duration-300 ease-out"
                    >
                      <button
                        type="button"
                        onClick={() => setViewingKey(p.key)}
                        className="w-9 h-9 rounded-md bg-white
                                   flex items-center justify-center shadow
                                   transition-transform duration-150 ease-out hover:scale-110 active:scale-95"
                        aria-label={`View ${p.file.name}`}
                      >
                        <ZoomoutIcon className="w-[30px] h-[30px]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeAt(index)}
                        className="w-9 h-9 rounded-md bg-white
                                   flex items-center justify-center shadow 
                                   transition-transform duration-150 ease-out hover:scale-110 active:scale-95"
                        aria-label={`Delete ${p.file.name}`}
                      >
                        <TrashIcon className="w-[30px] h-[30px]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View modal */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview dialog"
          onMouseDown={closeView}
        >
          <div
            className="max-w-[820px] w-full bg-white rounded-xl overflow-hidden shadow-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 flex items-center justify-between border-b">
              <p className="text-sm text-[#3A3A3A] truncate">
                {viewing.file.name}
              </p>
              <button
                type="button"
                className="text-sm text-[#2DA9FF]"
                onClick={closeView}
              >
                Close
              </button>
            </div>

            <div className="w-full bg-[#111] flex items-center justify-center">
              <img
                src={viewing.url}
                alt={viewing.file.name}
                className="max-h-[70vh] w-auto object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
