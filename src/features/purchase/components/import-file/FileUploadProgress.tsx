import UploadingIcon from "../../../../assets/svg/file-uploading.svg?react";

interface Props {
  progress: number;
}

export default function FileUploadProgress({ progress }: Props) {
  return (
    <div className="mt-2">
      {/* row icon + text */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
        <UploadingIcon className="w-4 h-4" />
        <span>Uploading...</span>
      </div>

      {/* progress bar */}
      <div className="w-full h-[3px] bg-[#E5E5E5] rounded overflow-hidden relative">
        <div
          className="absolute h-full bg-[#0690F1] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
