type Props = {
  title: string;
  artist: string;
};

export default function MediaCard({
  title,
  artist,
}: Props) {
  return (
    <div
      className="
        p-4
        rounded-xl
        hover:bg-[#1f1f1f]
        transition-all
        duration-300
        cursor-pointer
        group
      "
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-xl
        "
      >
        <div
          className="
            w-full
            h-[220px]
            bg-gradient-to-br
            from-gray-700
            to-gray-900
          "
        ></div>

        <button
          className="
            absolute
            bottom-4
            right-4
            w-14
            h-14
            rounded-full
            bg-green-500
            text-black
            text-xl
            shadow-2xl
            opacity-0
            translate-y-3
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all
          "
        >
          ▶
        </button>
      </div>

      <h3 className="mt-4 font-bold text-lg">
        {title}
      </h3>

      <p className="text-gray-400 mt-2 text-sm">
        {artist}
      </p>
    </div>
  );
}