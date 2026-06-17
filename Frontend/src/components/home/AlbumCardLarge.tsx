import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { PlayIcon } from "../common/icons";

type Props = {
  track: Media;
  tracks: Media[];
  onOpenAlbum: (track: Media, tracks: Media[]) => void;
};

const AlbumCardLarge = ({ track, tracks, onOpenAlbum }: Props) => {
  const [hovered, setHovered] = useState(false);

  const {
    currentTrack,
    isPlaying,
    playTrack,
    setQueue,
    togglePlay,
  } = usePlayer();

  const isCurrentTrack = String(currentTrack?.id) === String(track.id);
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isCurrentTrack) {
      togglePlay();
      return;
    }

    setQueue(tracks);
    playTrack(track);
  };

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

        {(hovered || isCurrentTrack) && (
          <button
            onClick={handlePlay}
            title={isThisPlaying ? "Tạm dừng" : "Phát"}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
            }}
          >
            {isThisPlaying ? "⏸" : <PlayIcon />}
          </button>
        )}
      </div>

      <div
        style={{
          color: isCurrentTrack ? "#1DB954" : "#fff",
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
        {track.artist?.name ?? "Unknown Artist"}
      </div>
    </div>
  );
};

export default AlbumCardLarge;