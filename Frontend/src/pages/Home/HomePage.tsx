import MediaCard from "../../components/media/MediaCard";

const songs = [
  {
    id: 1,
    title: "Em",
    artist: "Binz, SOOBIN",
  },
  {
    id: 2,
    title: "Cho Con",
    artist: "B Ray",
  },
  {
    id: 3,
    title: "Sau Này Em Cưới Ai Rồi",
    artist: "Kiều Chi",
  },
  {
    id: 4,
    title: "Một Nửa Sự Thật",
    artist: "24K.Right",
  },
];

export default function HomePage() {
  return (
    <div>
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold">
            Những bài hát thịnh hành
          </h2>

          <button className="text-gray-400 hover:text-white">
            Hiện tất cả
          </button>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >
          {songs.map((song) => (
            <MediaCard
              key={song.id}
              title={song.title}
              artist={song.artist}
            />
          ))}
        </div>
      </section>
    </div>
  );
}