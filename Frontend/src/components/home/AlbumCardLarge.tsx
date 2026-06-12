import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";

type Props = {
  track: Media;
  tracks: Media[];

  // NEW: click card mở view album/playlist
  onOpenAlbum: (track: Media, tracks: Media[]) => void;
};

const AlbumCardLarge = ({ track, tracks, onOpenAlbum }: Props) => {
  const [hovered, setHovered] = useState(false);
  const { playTrack, setQueue } = usePlayer();

  return (
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
        transition: "background .18s ease",
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
          boxShadow: "0 8px 24px rgba(0,0,0,.3)",
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQueue(tracks);
              playTrack(track);
            }}
            title="Phát"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "none",
              background: "#1DB954",
              color: "#000",
              cursor: "pointer",
              fontWeight: 900,
              boxShadow: "0 8px 20px rgba(0,0,0,.35)",
            }}
          >
            ▶
          </button>
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
  );
};

export default AlbumCardLarge;
