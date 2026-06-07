import { useState, useRef } from "react";
import type { Media } from "../../types/media";
import type { RepeatMode } from "../../types/player";

interface PlayerBarProps {
  currentTrack: Media | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isMuted: boolean;

  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeatMode: () => void;
  onToggleMuted: () => void;
}

const formatSeconds = (sec: number) => {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
};

const Slider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );

    onChange(percent * 100);
  };

  return (
    <div
      ref={trackRef}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        height: "4px",
        background: "#4d4d4d",
        borderRadius: "999px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: hovered ? "#1DB954" : "#fff",
          borderRadius: "999px",
        }}
      />

      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          left: `${value}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: hovered ? 1 : 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

const IconBtn = ({
  children,
  title,
  active,
  onClick,
}: {
  children: React.ReactNode;
  title?: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      background: "none",
      border: "none",
      color: active ? "#1DB954" : "#b3b3b3",
      cursor: "pointer",
      padding: "6px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = active ? "#1DB954" : "#fff";
      e.currentTarget.style.transform = "scale(1.08)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = active ? "#1DB954" : "#b3b3b3";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    {children}
  </button>
);

const PlayerBar = ({
  currentTrack,
  isPlaying,
  position,
  duration,
  volume,
  isShuffle,
  repeatMode,
  isMuted,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeatMode,
  onToggleMuted,
}: PlayerBarProps) => {
// FIX: ưu tiên duration thật từ audio metadata
const safeDuration = duration || currentTrack?.duration || 0;

  const progressPercent =
    safeDuration > 0 ? Math.min((position / safeDuration) * 100, 100) : 0;

  const handleSeekPercent = (percent: number) => {
    const nextPosition = Math.round((percent / 100) * safeDuration);
    onSeek(nextPosition);
  };

  return (
    <footer
      style={{
        height: "90px",
        flexShrink: 0,
        background: "#181818",
        borderTop: "1px solid #282828",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "center",
        padding: "0 16px",
        zIndex: 200,
        userSelect: "none",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "4px",
            background: "#2a2a2a",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b3b3b3",
            fontSize: "22px",
          }}
        >
          {currentTrack?.thumbnailUrl ? (
            <img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            "🎵"
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: currentTrack ? "#fff" : "#6b6b6b",
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack?.title ?? "Chưa phát bài nào"}
          </div>

          <div
            style={{
              color: "#b3b3b3",
              fontSize: "12px",
              marginTop: "2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack?.artist?.name ?? ""}
          </div>
        </div>

        <IconBtn title="Thêm vào thư viện">
          ♡
        </IconBtn>
      </div>

      {/* Center */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <IconBtn
            title="Phát ngẫu nhiên"
            active={isShuffle}
            onClick={onToggleShuffle}
          >
            🔀
          </IconBtn>

          <IconBtn title="Trước" onClick={onPrev}>
            ⏮
          </IconBtn>

          <button
            onClick={onTogglePlay}
            disabled={!currentTrack}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "none",
              background: currentTrack ? "#fff" : "#4d4d4d",
              color: "#000",
              cursor: currentTrack ? "pointer" : "default",
              fontSize: "16px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!currentTrack) return;
              e.currentTarget.style.transform = "scale(1.07)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <IconBtn title="Tiếp theo" onClick={onNext}>
            ⏭
          </IconBtn>

          <IconBtn
            title="Lặp lại"
            active={repeatMode !== "off"}
            onClick={onToggleRepeatMode}
          >
            {repeatMode === "one" ? "🔂" : "🔁"}
          </IconBtn>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            maxWidth: "480px",
          }}
        >
          <span
            style={{
              color: "#b3b3b3",
              fontSize: "11px",
              minWidth: "32px",
              textAlign: "right",
            }}
          >
            {formatSeconds(position)}
          </span>

          <Slider value={progressPercent} onChange={handleSeekPercent} />

          <span
            style={{
              color: "#b3b3b3",
              fontSize: "11px",
              minWidth: "32px",
            }}
          >
            {formatSeconds(safeDuration)}
          </span>
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "6px",
        }}
      >
        <IconBtn title="Now Playing View">▣</IconBtn>
        <IconBtn title="Hàng chờ">☰</IconBtn>
        <IconBtn title="Thiết bị">▱</IconBtn>

        <IconBtn title="Âm lượng" onClick={onToggleMuted}>
          {isMuted || volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊"}
        </IconBtn>

        <div style={{ width: "90px" }}>
          <Slider value={isMuted ? 0 : volume} onChange={onVolumeChange} />
        </div>

        <IconBtn title="Toàn màn hình">⛶</IconBtn>
      </div>
    </footer>
  );
};

export default PlayerBar;