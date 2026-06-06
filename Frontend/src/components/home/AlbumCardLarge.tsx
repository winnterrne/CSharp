import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import AddToPlaylistModal from "../playlist/AddToPlaylistModal";

type Props = {
  track: Media;
  tracks: Media[];

  // NEW: click card mở view album/playlist
  onOpenAlbum: (track: Media, tracks: Media[]) => void;
};

const AlbumCardLarge = ({ track, tracks, onOpenAlbum }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const { playTrack, setQueue } = usePlayer();

  return (
    <>
      <div
        onClick={() => onOpenAlbum(track, tracks)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#282828" : "#181818",
          borderRadius: "12px",
          padding: "16px",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            paddingBottom: "100%",
            borderRadius: "8px",
            background: "#2a2a2a",
            position: "relative",
            marginBottom: "14px",
            overflow: "hidden",
          }}
        >
          {track.thumbnailUrl ? (
            <img
              src={track.thumbnailUrl}
              alt={track.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
              }}
            >
              🎵
            </div>
          )}

          {hovered && (
            <>
              {/* NEW: thêm vào playlist */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddModal(true);
                }}
                title="Thêm vào playlist"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,.65)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ＋
              </button>

              {/* NEW: phát bài */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQueue(tracks);
                  playTrack(track);
                }}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#1DB954",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                ▶
              </button>
            </>
          )}
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: "15px",
            fontWeight: 700,
            marginBottom: "5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {track.title}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: "13px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {track.artist.name}
        </div>
      </div>

      <AddToPlaylistModal
        open={showAddModal}
        media={track}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
};

export default AlbumCardLarge;