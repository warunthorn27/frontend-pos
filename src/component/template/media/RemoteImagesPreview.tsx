type RemoteImagesPreviewProps = {
  images: string[];
};

export default function RemoteImagesPreview({
  images,
}: RemoteImagesPreviewProps) {
  if (images.length === 0) return null;

  const mainImage = images[0];
  const thumbnails = images.slice(1);

  // กรณีมีรูปเดียว
  if (images.length === 1) {
    return (
      <div className="flex justify-center">
        <img
          src={mainImage}
          alt="product"
          className="w-full aspect-square rounded-lg object-cover border"
        />
      </div>
    );
  }

  // กรณีมีหลายรูป
  return (
    <div className="space-y-3">
      {/* Main image */}
      <img
        src={mainImage}
        alt="product-main"
        className="w-full aspect-square rounded-lg object-cover border"
      />

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {thumbnails.map((url, index) => (
          <img
            key={url + index}
            src={url}
            alt={`product-thumb-${index}`}
            className="aspect-square rounded-md object-cover border cursor-pointer hover:ring-2 hover:ring-[#2DA9FF]"
          />
        ))}
      </div>
    </div>
  );
}
