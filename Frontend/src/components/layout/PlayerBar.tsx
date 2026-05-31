import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;   // seconds
  color?: string;
  emoji?: string;
  albumArt?: string;  // URL tuỳ chọn
}

export interface PlayerBarProps {
  // State
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;       // 0–100
  volume: number;         // 0–100
  shuffle: boolean;
  repeat: boolean;
  liked?: boolean;

  // Callbacks
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (pct: number) => void;
  onVolumeChange: (pct: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike?: () => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const ShuffleIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "#1DB954" : "currentColor"}>
    <path d="M17.65 3L22 7.35l-4.35 4.35-1.41-1.41 2.44-2.44H14c-1.1 0-2.03.6-2.56 1.5l-.97 1.64c.83.29 1.58.79 2.18 1.44l.73-1.22c.2-.33.56-.54.95-.54h3.97l-2.44 2.44 1.41 1.41L22 9.94l.01-.01L17.65 3zM2 7h5.5l2.57 4.35L8.6 13.2C8.2 13.72 7.62 14 7 14H2v2h5c1.1 0 2.03-.6 2.56-1.5L12 11.5l2.44 4.12c.53.9 1.46 1.5 2.56 1.5h1.25l2.44 2.44L22 18.12 17.65 21 14 17.65l1.41-1.41 2.44 2.44H16.44c-.39 0-.75-.2-.95-.54L12 13.5l-3.49 5.64c-.53.9-1.46 1.5-2.56 1.5H2v-2h3.94c.39 0 .75-.2.95-.54L9.38 14H2V7z" />
  </svg>
);

const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
);

const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const RepeatIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "#1DB954" : "currentColor"}>
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
  </svg>
);

const NowPlayingViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 17H9V8l-4 4-1.42-1.41L10 4.17l6.41 6.41L15 12l-4-4v9zm6.41.59L16 19l1.59 1.59L19 19l-1.59-1.41zM20 3H4v2h16V3zM4 21h7v-2H4v2zm13-4h-3v2h3v-2zm-6 0H4v2h7v-2z" />
  </svg>
);

const QueueIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
  </svg>
);

const DeviceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 9V3h-6v2H8V3H2v6h2v9c0 1.1.9 2 2 2h4v2h4v-2h4c1.1 0 2-.9 2-2V9h2zM4 5h2v2H4V5zm14 13H6V9h12v9zm2-11h-2V5h2v2z" />
  </svg>
);

const VolumeIcon = ({ level }: { level: number }) => {
  if (level === 0)
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
    );
  if (level < 50)
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
};

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);

const HeartIcon = ({ liked }: { liked: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={liked ? "#1DB954" : "none"}
    stroke={liked ? "#1DB954" : "currentColor"}
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ─── Slider ───────────────────────────────────────────────────────────────────
const Slider = ({
  value,
  onChange,
  color = "#1DB954",
}: {
  value: number;
  onChange: (v: number) => void;
  color?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    onChange(pct * 100);
  };

  return (
    <div
      ref={trackRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        height: "4px",
        background: "#4d4d4d",
        borderRadius: "2px",
        cursor: "pointer",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${value}%`,
          background: hovered ? color : "#fff",
          borderRadius: "2px",
          transition: "background 0.15s",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${value}%`,
          transform: "translate(-50%, -50%)",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#fff",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

// ─── Icon Button ──────────────────────────────────────────────────────────────
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px",
      borderRadius: "4px",
      transition: "color 0.15s, transform 0.1s",
    }}
    onMouseEnter={(e) => {
      if (!active) e.currentTarget.style.color = "#fff";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatSeconds = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

// ─── Main Component ───────────────────────────────────────────────────────────
const PlayerBar = ({
  currentTrack,
  isPlaying,
  progress,
  volume,
  shuffle,
  repeat,
  liked = false,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
}: PlayerBarProps) => {
  const totalSec = currentTrack?.duration ?? 0;
  const currentSec = Math.round((progress / 100) * totalSec);

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
        fontFamily: "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        userSelect: "none",
      }}
    >
      {/* ── Left: Now Playing Info ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        {/* Album art */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "4px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            overflow: "hidden",
            background: currentTrack?.albumArt
              ? "transparent"
              : `linear-gradient(135deg, ${currentTrack?.color ?? "#1a3050"}, #1DB954)`,
          }}
        >
          {currentTrack?.albumArt ? (
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            currentTrack?.emoji ?? "🎵"
          )}
        </div>

        {/* Song info */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: currentTrack ? "#fff" : "#6b6b6b",
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "-0.01em",
            }}
          >
            {currentTrack?.title ?? "Chưa phát bài nào"}
          </div>
          <div
            style={{
              color: "#b3b3b3",
              fontSize: "11px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: "2px",
            }}
          >
            {currentTrack?.artist ?? ""}
          </div>
        </div>

        {/* Heart – chỉ hiện khi có bài */}
        {currentTrack && onToggleLike && (
          <IconBtn title="Thêm vào thư viện" active={liked} onClick={onToggleLike}>
            <HeartIcon liked={liked} />
          </IconBtn>
        )}
      </div>

      {/* ── Center: Controls + Progress ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          width: "100%",
        }}
      >
        {/* Control buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <IconBtn title="Phát ngẫu nhiên" active={shuffle} onClick={onToggleShuffle}>
            <ShuffleIcon active={shuffle} />
          </IconBtn>

          <IconBtn title="Trước" onClick={onPrev}>
            <PrevIcon />
          </IconBtn>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            disabled={!currentTrack}
            style={{
              background: currentTrack ? "#fff" : "#4d4d4d",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: currentTrack ? "pointer" : "default",
              margin: "0 4px",
              transition: "transform 0.1s ease, background 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!currentTrack) return;
              e.currentTarget.style.transform = "scale(1.07)";
              e.currentTarget.style.background = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = currentTrack ? "#fff" : "#4d4d4d";
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <IconBtn title="Tiếp theo" onClick={onNext}>
            <NextIcon />
          </IconBtn>

          <IconBtn title="Lặp lại" active={repeat} onClick={onToggleRepeat}>
            <RepeatIcon active={repeat} />
          </IconBtn>
        </div>

        {/* Progress bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            maxWidth: "480px",
          }}
        >
          <span style={{ color: "#b3b3b3", fontSize: "11px", minWidth: "32px", textAlign: "right" }}>
            {formatSeconds(currentSec)}
          </span>
          <Slider value={progress} onChange={onSeek} color="#1DB954" />
          <span style={{ color: "#b3b3b3", fontSize: "11px", minWidth: "32px" }}>
            {formatSeconds(totalSec)}
          </span>
        </div>
      </div>

      {/* ── Right: Extra Controls ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "4px",
        }}
      >
        <IconBtn title="Now Playing View">
          <NowPlayingViewIcon />
        </IconBtn>

        <IconBtn title="Hàng chờ">
          <QueueIcon />
        </IconBtn>

        <IconBtn title="Thiết bị">
          <DeviceIcon />
        </IconBtn>

        <IconBtn title="Âm lượng">
          <VolumeIcon level={volume} />
        </IconBtn>

        <div style={{ width: "80px" }}>
          <Slider value={volume} onChange={onVolumeChange} color="#1DB954" />
        </div>

        <IconBtn title="Toàn màn hình">
          <FullscreenIcon />
        </IconBtn>
      </div>
    </footer>
  );
};

export default PlayerBar;