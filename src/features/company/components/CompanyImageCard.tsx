import React, { useCallback, useMemo, useRef, useState } from "react";
import UploadImage from "../../../assets/svg/upload-image.svg?react";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import ZoomoutIcon from "../../../assets/svg/zoom-out.svg?react";

type Props = {
  value: File | null;
  compFile: string | null;
  onChange: (file: File | null) => void;
};

function isAllowedImage(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeMB = 5;

  if (!allowedTypes.includes(file.type)) return false;
  if (file.size > maxSizeMB * 1024 * 1024) return false;

  return true;
}

export default function SingleImageUploadCard({
  value,
  compFile,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // states that were missing
  const [isViewing, setIsViewing] = useState(false);
  const isUploading = false; // single image UI-only (future-proof)

  const previewUrl = useMemo(() => {
    // มีไฟล์ใหม่ที่เลือก
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    // ไม่มีไฟล์ใหม่ แต่มีรูปจาก backend
    if (compFile) {
      return compFile;
    }

    // ไม่มีรูปเลย
    return null;
  }, [value, compFile]);

  const pickFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!isAllowedImage(file)) return;
      onChange(file);
    },
    [onChange],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setIsViewing(false);
    onChange(null);
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        /* Upload UI */
        <div
          className="
            h-44
            rounded-lg
            border-2 border-dashed border-[#7AB8FF]
            bg-[#F7FBFF]
            flex flex-col items-center justify-center
            cursor-pointer
            text-center
          "
          onClick={pickFile}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <UploadImage className="w-8 h-8 mb-3 text-[#7A7A7A]" />

          <p className="text-xs leading-6">
            <span className="text-[#2DA9FF] font-normal">Click to upload</span>{" "}
            <br />
            <span className="text-[#525252]">or drag and drop</span>
            <br />
            <span className="text-xs font-light text-[#545454]">
              JPG, PNG, WebP (Max 5MB)
            </span>
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      ) : (
        /* Preview + Hover Overlay */
        <div className="group relative h-44 rounded-[16px] overflow-hidden bg-[#F3F3F3]">
          <img
            src={previewUrl}
            alt={value?.name ?? "Preview"}
            className="w-full h-full object-contain"
            draggable={false}
          />

          {/* Hover overlay + slide-up icons */}
          {!isUploading && (
            <div
              className="
                absolute inset-0
                bg-black/35
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200 ease-out
                flex items-center justify-center
              "
            >
              <div
                className="
                  flex items-center gap-2
                  translate-y-6 opacity-0
                  group-hover:translate-y-0 group-hover:opacity-100
                  transition-all duration-300 ease-out
                "
              >
                {/* Zoom */}
                <button
                  type="button"
                  onClick={() => setIsViewing(true)}
                  className="
                    w-8 h-8 rounded-md bg-white
                    flex items-center justify-center shadow
                    transition-transform duration-150 ease-out
                    hover:scale-110 active:scale-95
                  "
                  aria-label={`View ${value?.name}`}
                >
                  <ZoomoutIcon className="w-6 h-6" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={removeImage}
                  className="
                    w-8 h-8 rounded-md bg-white
                    flex items-center justify-center shadow
                    transition-transform duration-150 ease-out
                    hover:scale-110 active:scale-95
                  "
                  aria-label={`Delete ${value?.name}`}
                >
                  <TrashIcon className="w-6 h-6 text-[#E71010]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {isViewing && previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onMouseDown={() => setIsViewing(false)}
        >
          <div
            className="max-w-[820px] w-full bg-white rounded-xl overflow-hidden shadow-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 flex items-center justify-between border-b">
              <p className="text-sm text-[#3A3A3A] truncate">{value?.name}</p>
              <button
                type="button"
                className="text-sm text-[#2DA9FF]"
                onClick={() => setIsViewing(false)}
              >
                Close
              </button>
            </div>

            <div className="w-full bg-[#111] flex items-center justify-center">
              <img
                src={previewUrl}
                alt={value?.name ?? "Preview"}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
