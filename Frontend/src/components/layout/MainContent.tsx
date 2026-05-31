const songs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
  },
  {
    id: 2,
    title: "Starboy",
    artist: "The Weeknd",
  },
  {
    id: 3,
    title: "Believer",
    artist: "Imagine Dragons",
  },
  {
    id: 4,
    title: "Shape of You",
    artist: "Ed Sheeran",
  },
];

export default function MainContent() {
  return (
    <div className="flex-1 bg-[#181818] p-6 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6">
        Trending Songs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-[#282828] p-4 rounded-xl hover:bg-[#333333] transition cursor-pointer"
          >
            <div className="w-full h-[180px] bg-gray-700 rounded-lg mb-4"></div>

            <h3 className="font-bold text-lg">
              {song.title}
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              {song.artist}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}