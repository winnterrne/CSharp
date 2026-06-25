type MediaCardProps = {
  title: string;
  artist: string;
  image: string;
};

export default function MediaCard({
  title,
  artist,
  image,
}: MediaCardProps) {
  return (
    <div
      className="
        bg-[#181818]
        rounded-xl
        p-4
        hover:bg-[#282828]
        transition-all
        cursor-pointer
      "
    >
      <img
        src={image}
        alt={title}
        className="
          w-full
          aspect-square
          object-cover
          rounded-lg
        "
      />

      <h3 className="mt-3 font-bold text-white">
        {title}
      </h3>

      <p className="text-gray-400 text-sm mt-1">
        {artist}
      </p>
    </div>
  );
}