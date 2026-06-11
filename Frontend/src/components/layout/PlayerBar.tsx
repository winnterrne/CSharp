import { useRef, useState } from "react";
import type { Media } from "../../types/media";
import type { RepeatMode } from "../../types/player";
import { useFavorite } from "../../hooks/useFavorite";

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

  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const Icon = ({
  children,
  size = 20,
}: {
  children: React.ReactNode;
  size?: number;
}) => (
  <span
    style={{
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </span>
);

const ShuffleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3h5v5" />
    <path d="M4 7h3c2.5 0 4 5 6.5 5H21" />
    <path d="M16 21h5v-5" />
    <path d="M4 17h3c1.2 0 2.2-.8 3.1-1.9" />
  </svg>
);

const PrevIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 5h2v14H6z" />
    <path d="M19 6v12L9 12z" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 5h2v14h-2z" />
    <path d="M5 6v12l10-6z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 5h4v14H7z" />
    <path d="M13 5h4v14h-4z" />
  </svg>
);

const RepeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
  </svg>
);

const RepeatOneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
    <text x="11.2" y="15.5" fontSize="7" fill="currentColor" stroke="none">
      1
    </text>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
  </svg>
);

const QueueIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16" />
    <path d="M4 12h10" />
    <path d="M4 18h7" />
    <path d="M17 15l4 3-4 3v-6z" />
  </svg>
);

const DeviceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="12" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
);

const VolumeIcon = ({ muted, volume }: { muted: boolean; volume: number }) => {
  if (muted || volume === 0) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M11 5L6 9H3v6h3l5 4z" />
        <path d="M18 9l4 4" />
        <path d="M22 9l-4 4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H3v6h3l5 4z" />
      {volume > 35 && <path d="M15 9a5 5 0 010 6" />}
      {volume > 70 && <path d="M18 6a9 9 0 010 12" />}
    </svg>
  );
};

const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3H3v5" />
    <path d="M16 3h5v5" />
    <path d="M3 16v5h5" />
    <path d="M21 16v5h-5" />
  </svg>
);

const NowPlayingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M8 15l2.5-3 2 2.5L15 11l3 4" />
  </svg>
);

const Slider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1,
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
        height: "12px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "#4d4d4d",
          borderRadius: "999px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${Math.min(Math.max(value, 0), 100)}%`,
            height: "100%",
            background: hovered ? "#1ed760" : "#fff",
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
            left: `${Math.min(Math.max(value, 0), 100)}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            opacity: hovered ? 1 : 0,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

const IconBtn = ({
  children,
  title,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  title?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <button
    title={title}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    style={{
      width: "32px",
      height: "32px",
      border: "none",
      background: "transparent",
      color:
        disabled ? "#535353"
        : active ? "#1ed760"
        : "#b3b3b3",
      cursor: disabled ? "default" : "pointer",
      padding: 0,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: ".15s ease",
    }}
    onMouseEnter={(e) => {
      if (disabled) return;
      e.currentTarget.style.color = active ? "#1ed760" : "#fff";
      e.currentTarget.style.transform = "scale(1.08)";
    }}
    onMouseLeave={(e) => {
      if (disabled) return;
      e.currentTarget.style.color = active ? "#1ed760" : "#b3b3b3";
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
  const safeDuration = duration || currentTrack?.duration || 0;
  const { isFavorite, toggleFavorite } = useFavorite();

  const liked = currentTrack ? isFavorite(currentTrack.id) : false;
  const progressPercent =
    safeDuration > 0 ? Math.min((position / safeDuration) * 100, 100) : 0;

  const artistName = currentTrack?.artist?.name ?? "";

  const handleSeekPercent = (percent: number) => {
    if (!safeDuration) return;

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
        gridTemplateColumns:
          "minmax(180px, 1fr) minmax(320px, 1.4fr) minmax(180px, 1fr)",
        alignItems: "center",
        padding: "0 16px",
        boxSizing: "border-box",
        zIndex: 200,
        userSelect: "none",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "4px",
            background: "#282828",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b3b3b3",
          }}
        >
          {currentTrack?.thumbnailUrl ?
            <img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          : <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          }
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
              maxWidth: "220px",
            }}
            title={currentTrack?.title ?? "Chưa phát bài nào"}
          >
            {currentTrack?.title ?? "Chưa phát bài nào"}
          </div>

          <div
            style={{
              color: "#b3b3b3",
              fontSize: "12px",
              marginTop: "3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "220px",
            }}
            title={artistName}
          >
            {artistName}
          </div>
        </div>

        <IconBtn
          title="Thêm vào thư viện"
          active={liked}
          disabled={!currentTrack}
          onClick={() => {
            if (!currentTrack) return;

            toggleFavorite(currentTrack.id);
          }}
        >
          <Icon size={18}>
            <HeartIcon />
          </Icon>
        </IconBtn>
      </div>

      {/* CENTER */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IconBtn
            title="Phát ngẫu nhiên"
            active={isShuffle}
            disabled={!currentTrack}
            onClick={onToggleShuffle}
          >
            <Icon size={18}>
              <ShuffleIcon />
            </Icon>
          </IconBtn>

          <IconBtn title="Trước" disabled={!currentTrack} onClick={onPrev}>
            <Icon size={20}>
              <PrevIcon />
            </Icon>
          </IconBtn>

          <button
            title={isPlaying ? "Tạm dừng" : "Phát"}
            onClick={onTogglePlay}
            disabled={!currentTrack}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "none",
              background: currentTrack ? "#fff" : "#535353",
              color: "#000",
              cursor: currentTrack ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: ".15s ease",
            }}
            onMouseEnter={(e) => {
              if (!currentTrack) return;
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Icon size={20}>
              {isPlaying ?
                <PauseIcon />
              : <PlayIcon />}
            </Icon>
          </button>

          <IconBtn title="Tiếp theo" disabled={!currentTrack} onClick={onNext}>
            <Icon size={20}>
              <NextIcon />
            </Icon>
          </IconBtn>

          <IconBtn
            title="Lặp lại"
            active={repeatMode !== "off"}
            disabled={!currentTrack}
            onClick={onToggleRepeatMode}
          >
            <Icon size={18}>
              {repeatMode === "one" ?
                <RepeatOneIcon />
              : <RepeatIcon />}
            </Icon>
          </IconBtn>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            maxWidth: "540px",
          }}
        >
          <span
            style={{
              color: "#b3b3b3",
              fontSize: "11px",
              minWidth: "38px",
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
              minWidth: "38px",
            }}
          >
            {formatSeconds(safeDuration)}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <IconBtn title="Now Playing View" disabled={!currentTrack}>
          <Icon size={18}>
            <NowPlayingIcon />
          </Icon>
        </IconBtn>

        <IconBtn title="Hàng chờ" disabled={!currentTrack}>
          <Icon size={18}>
            <QueueIcon />
          </Icon>
        </IconBtn>

        <IconBtn title="Thiết bị">
          <Icon size={18}>
            <DeviceIcon />
          </Icon>
        </IconBtn>

        <IconBtn title="Âm lượng" onClick={onToggleMuted}>
          <Icon size={20}>
            <VolumeIcon muted={isMuted} volume={volume} />
          </Icon>
        </IconBtn>

        <div style={{ width: "92px" }}>
          <Slider value={isMuted ? 0 : volume} onChange={onVolumeChange} />
        </div>

        <IconBtn title="Toàn màn hình">
          <Icon size={18}>
            <FullscreenIcon />
          </Icon>
        </IconBtn>
      </div>
    </footer>
  );
};

export default PlayerBar;
