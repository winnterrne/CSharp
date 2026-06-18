import { useNavigate } from "react-router-dom";
import type { ArtistSearchResult } from "../../api/artistApi";

const buildArtistImageUrl = (img?: string | null) => {
  if (!img) return "";

  if (img.startsWith("http")) return img;

  if (img.startsWith("/")) return `http://localhost:5081${img}`;

  if (img.includes("/")) return `http://localhost:5081/${img}`;

  return `http://localhost:5081/media/images/artist/${img}`;
};

const SearchArtistCard = ({ artist }: { artist: ArtistSearchResult }) => {
  const navigate = useNavigate();

  const artistId = artist.artistID;
  const artistName = artist.artistName ?? "Unknown Artist";
  const avatarUrl = buildArtistImageUrl(artist.artistImage);
  const initial = artistName.trim().charAt(0).toUpperCase() || "?";

  return (
    <button
      type="button"
      onClick={() => {
        navigate(`/artist/${encodeURIComponent(artistName)}`);
      }}
      style={{
        width: "100%",
        background: "#181818",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "1px solid #242424",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#333",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 900,
          fontSize: "20px",
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={artistName}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          initial
        )}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "15px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {artistName}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: "13px",
            marginTop: "4px",
          }}
        >
          Nghệ sĩ
        </div>

        {artist.bio && (
          <div
            style={{
              color: "#777",
              fontSize: "12px",
              marginTop: "4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {artist.bio}
          </div>
        )}
      </div>
    </button>
  );
};

export default SearchArtistCard;