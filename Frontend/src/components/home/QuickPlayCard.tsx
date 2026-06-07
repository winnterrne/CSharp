import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import AddToPlaylistModal from "../playlist/AddToPlaylistModal";

type Props = {
  track: Media;
  tracks: Media[];

  // NEW: click card mở trang chi tiết bài hát
  onOpenTrack: (track: Media) => void;
};

const QuickPlayCard = ({ track, tracks, onOpenTrack }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const { playTrack, setQueue } = usePlayer();

  return (
    <>
      <div
        onClick={() => onOpenTrack(track)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#2a2a2a" : "#181818",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          height: "64px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            background: "#2a2a2a",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {track.thumbnailUrl ? (
            <img
              src={track.thumbnailUrl}
              alt={track.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            "🎵"
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1, padding: "0 12px" }}>
          <div
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.title}
          </div>

          <div style={{ color: "#b3b3b3", fontSize: "12px" }}>
            {track.artist.name}
          </div>
        </div>

        {hovered && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingRight: "12px",
            }}
          >
            {/* NEW: thêm vào playlist */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
              title="Thêm vào playlist"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,.45)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ＋
            </button>

            {/* NEW: phát nhạc */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQueue(tracks);
                playTrack(track);
              }}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                background: "#1DB954",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      <AddToPlaylistModal
        open={showAddModal}
        media={track}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
};

export default QuickPlayCard;