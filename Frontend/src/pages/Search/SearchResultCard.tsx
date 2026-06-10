import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import AddToPlaylistModal from "../../components/playlist/AddToPlaylistModal";

const SearchResultCard = ({ item }: { item: Media }) => {
  const { playTrack, setQueue } = usePlayer();
  const [menuOpen, setMenuOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <>
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
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative",
        }}
      >
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "6px",
            objectFit: "cover",
            background: "#333",
          }}
        />

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
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
            {item.artist.name}
          </div>
        </div>

        {/* NEW: nút menu */}
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
            fontSize: "20px",
          }}
        >
          ⋮
        </button>

        {/* NEW: dropdown menu */}
        {menuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: "10px",
              top: "48px",
              width: "190px",
              background: "#282828",
              borderRadius: "8px",
              padding: "6px",
              zIndex: 20,
              boxShadow: "0 12px 40px rgba(0,0,0,.45)",
            }}
          >
            <button
              onClick={() => {
                setQueue([item]);
                playTrack(item);
                setMenuOpen(false);
              }}
              style={menuItemStyle}
            >
              ▶ Phát ngay
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                setAddModalOpen(true);
              }}
              style={menuItemStyle}
            >
              ＋ Thêm vào playlist
            </button>
          </div>
        )}
      </div>

      <AddToPlaylistModal
        open={addModalOpen}
        media={item}
        onClose={() => setAddModalOpen(false)}
      />
    </>
  );
};

const menuItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "14px",
};

export default SearchResultCard;