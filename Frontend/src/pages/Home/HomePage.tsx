import MediaCard from "../../components/media/MediaCard";

const songs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    image:
      "https://picsum.photos/300?1",
  },
  {
    id: 2,
    title: "Starboy",
    artist: "The Weeknd",
    image:
      "https://picsum.photos/300?2",
  },
  {
    id: 3,
    title: "Believer",
    artist: "Imagine Dragons",
    image:
      "https://picsum.photos/300?3",
  },
  {
    id: 4,
    title: "Faded",
    artist: "Alan Walker",
    image:
      "https://picsum.photos/300?4",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Trending */}
      <section>
        <h2 className="text-3xl font-bold mb-6">
          Trending Songs
        </h2>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {songs.map((song) => (
            <MediaCard
              key={song.id}
              title={song.title}
              artist={song.artist}
              image={song.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}