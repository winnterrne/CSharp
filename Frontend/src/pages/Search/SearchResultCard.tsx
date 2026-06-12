import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import AddToPlaylistButton from "../../components/playlist/AddToPlaylistButton";
import TrackActionMenu from "../../components/common/TrackActionMenu";
import { useState } from "react";

const SearchResultCard = ({ item }: { item: Media }) => {
  const { playTrack, setQueue } = usePlayer();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={() => {
        setQueue([item]);
        playTrack(item);
      }}
      style={{
        background: "#181818",
        borderRadius: "8px",
        padding: "10px",
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "50px minmax(0,1fr) 40px 40px",
        alignItems: "center",
        gap: "12px",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#242424";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#181818";
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "6px",
          overflow: "hidden",
          background: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b3b3b3",
        }}
      >
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          "♪"
        )}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 700,
          }}
        >
          {item.title}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: "13px",
          }}
        >
          {item.artist?.name ?? "Unknown Artist"}
        </div>
      </div>

      <AddToPlaylistButton mediaId={item.id} />

      <div style={{ position: "relative" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "22px",
          }}
        >
          ⋯
        </button>

        <TrackActionMenu
          track={item}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </div>
  );
};

export default SearchResultCard;