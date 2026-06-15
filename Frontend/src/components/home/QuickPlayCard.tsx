import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useHistoryStore } from "../../store/historyStore";
import { PlayIcon } from "../common/icons";

type Props = {
  track: Media;
  tracks: Media[];
  onOpenTrack: (track: Media) => void;
};

const QuickPlayCard = ({ track, tracks, onOpenTrack }: Props) => {
  const [hovered, setHovered] = useState(false);

  const { playTrack, setQueue } = usePlayer();
  const addRecentTrack = useHistoryStore((state) => state.addRecentTrack);

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setQueue(tracks);
    addRecentTrack(track);
    playTrack(track);
  };

  return (
    <div
      onClick={() => onOpenTrack(track)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#2a2a2a" : "rgba(255,255,255,.08)",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        height: "64px",
        transition: "background .18s ease",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          background: "#282828",
          flexShrink: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b3b3b3",
          fontSize: "26px",
        }}
      >
        {track.thumbnailUrl ?
        
          <img
            src={track.thumbnailUrl}
            alt={track.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        : "🎵"}
      </div>

      <div
        style={{
          minWidth: 0,
          flex: 1,
          padding: "0 12px",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={track.title}
        >
          {track.title}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: "12px",
            marginTop: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={track.artist?.name ?? "Unknown Artist"}
        >
          {track.artist?.name ?? "Unknown Artist"}
        </div>
      </div>

      {hovered && (
        <button
          onClick={handlePlay}
          title="Phát"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "none",
            background: "#1DB954",
            color: "#000",
            cursor: "pointer",
            fontWeight: 900,
            marginRight: "12px",
            boxShadow: "0 8px 16px rgba(0,0,0,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "17px",
            transform: hovered ? "scale(1)" : "scale(.95)",
            transition: ".18s ease",
          }}
        >
          <PlayIcon/>
        </button>
      )}
    </div>
  );
};

export default QuickPlayCard;
