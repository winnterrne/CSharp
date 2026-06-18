import type { ArtistSearchResult } from "../../api/artistApi";
import SearchArtistCard from "./SearchArtistCard";

const SearchArtistSection = ({
  artists,
}: {
  artists: ArtistSearchResult[];
}) => {
  if (artists.length === 0) return null;

  return (
    <section style={{ marginBottom: "38px" }}>
      <h2
        style={{
          fontSize: "24px",
          marginBottom: "16px",
          color: "#fff",
        }}
      >
        Nghệ sĩ
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        {artists.map((artist) => (
          <SearchArtistCard key={artist.artistID} artist={artist} />
        ))}
      </div>
    </section>
  );
};

export default SearchArtistSection;