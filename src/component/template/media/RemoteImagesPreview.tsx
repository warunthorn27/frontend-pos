type RemoteImagesPreviewProps = {
  images: string[];
};

export default function RemoteImagesPreview({
  images,
}: RemoteImagesPreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((url, index) => (
        <img
          key={url + index}
          src={url}
          alt={`product-${index}`}
          className="aspect-square rounded-md object-cover border"
        />
      ))}
    </div>
  );
}
