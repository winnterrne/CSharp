// src/pages/Home/MainContent.tsx
import { useState, useEffect } from "react";
import { usePlayer } from "../../hooks/usePlayer";
import { mediaApi } from "../../api/mediaApi";
import type { Track } from "../../types/media";

// ─── Types ────────────────────────────────────────────────────────────────────
// AlbumCard dùng đúng Track từ backend, không tự định nghĩa lại
type AlbumCard = Track;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getTrackColor = (track: Track) => track.color ?? "#1a3050";
const getTrackEmoji = (track: Track) => track.emoji ?? "🎵";

// ─── PlayButton ───────────────────────────────────────────────────────────────
const PlayButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    style={{
      background: "#1DB954",
      border: "none",
      borderRadius: "50%",
      width: "48px",
      height: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      transition: "transform 0.15s ease, background 0.15s ease",
      flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.08)";
      e.currentTarget.style.background = "#1ed760";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.background = "#1DB954";
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
      <path d="M8 5v14l11-7z" />
    </svg>
  </button>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = ({ height = 56 }: { height?: number }) => (
  <div
    style={{
      height,
      borderRadius: "6px",
      background: "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }}
  />
);

// ─── QuickPlayCard ────────────────────────────────────────────────────────────
const QuickPlayCard = ({ track }: { track: Track }) => {
  const [hovered, setHovered] = useState(false);
  const { playTrack } = usePlayer();
  const color = getTrackColor(track);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:
          hovered ?
            `linear-gradient(135deg, ${color}dd, ${color}99)`
          : `linear-gradient(135deg, ${color}bb, ${color}66)`,
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        cursor: "pointer",
        transition: "background 0.2s ease",
        position: "relative",
        height: "56px",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "56px",
          height: "56px",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
          boxShadow: "4px 0 12px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {track.albumArt ?
          <img
            src={track.albumArt}
            alt={track.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        : getTrackEmoji(track)}
      </div>

      <span
        style={{
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          padding: "0 12px",
          flex: 1,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {track.title}
      </span>

      <div
        style={{
          position: "absolute",
          right: "12px",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.2s, transform 0.2s",
        }}
      >
        <PlayButton
          onClick={(e) => {
            e.stopPropagation();
            playTrack(track);
          }}
        />
      </div>
    </div>
  );
};

// ─── AlbumCardLarge ───────────────────────────────────────────────────────────
const AlbumCardLarge = ({ track }: { track: AlbumCard }) => {
  const [hovered, setHovered] = useState(false);
  const { playTrack } = usePlayer();
  const color = getTrackColor(track);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#282828" : "#181818",
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        transition: "background 0.2s ease",
        position: "relative",
        minWidth: "180px",
      }}
    >
      {/* Cover */}
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          borderRadius: "4px",
          background:
            track.albumArt ? "transparent" : (
              `linear-gradient(135deg, ${color}, ${color}88)`
            ),
          position: "relative",
          marginBottom: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {track.albumArt ?
          <img
            src={track.albumArt}
            alt={track.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        : <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 900,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.1em",
                textAlign: "center",
                padding: "0 12px",
                lineHeight: 1.2,
                textTransform: "uppercase",
              }}
            >
              {track.title}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
              {track.artist}
            </div>
          </div>
        }

        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.2s, transform 0.2s",
          }}
        >
          <PlayButton
            onClick={(e) => {
              e.stopPropagation();
              playTrack(track);
            }}
          />
        </div>
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: "14px",
          fontWeight: 700,
          marginBottom: "4px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {track.title}
      </div>
      <div style={{ color: "#b3b3b3", fontSize: "12px" }}>{track.artist}</div>
    </div>
  );
};

// ─── SectionHeader ────────────────────────────────────────────────────────────
const SectionHeader = ({
  label,
  title,
  onShowAll,
}: {
  label?: string;
  title: string;
  onShowAll?: () => void;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: label ? "flex-start" : "center",
      justifyContent: "space-between",
      marginBottom: label ? "4px" : "16px",
    }}
  >
    <div>
      {label && (
        <p
          style={{
            color: "#b3b3b3",
            fontSize: "12px",
            margin: "0 0 2px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
          }}
        >
          {label}
        </p>
      )}
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#fff",
          margin: label ? "0 0 16px" : 0,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
    </div>
    {onShowAll && (
      <button
        onClick={onShowAll}
        style={{
          background: "none",
          border: "none",
          color: "#b3b3b3",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
      >
        Hiện tất cả
      </button>
    )}
  </div>
);

// ─── Error Message ────────────────────────────────────────────────────────────
const ErrorMsg = ({ onRetry }: { onRetry: () => void }) => (
  <div
    style={{
      color: "#b3b3b3",
      fontSize: "13px",
      padding: "16px 0",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    }}
  >
    Không tải được dữ liệu.
    <button
      onClick={onRetry}
      style={{
        background: "none",
        border: "1px solid #555",
        color: "#fff",
        borderRadius: "4px",
        padding: "4px 12px",
        cursor: "pointer",
        fontSize: "12px",
      }}
    >
      Thử lại
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const MainContent = () => {
  const [activeTab, setActiveTab] = useState<"all" | "music" | "podcast">(
    "all",
  );

  const [recommended, setRecommended] = useState<Track[]>([]);
  const [forYou, setForYou] = useState<Track[]>([]);
  const [upcoming, setUpcoming] = useState<Track[]>([]);

  const [loadingRec, setLoadingRec] = useState(true);
  const [loadingFY, setLoadingFY] = useState(true);
  const [loadingUp, setLoadingUp] = useState(true);

  const [errorRec, setErrorRec] = useState(false);
  const [errorFY, setErrorFY] = useState(false);
  const [errorUp, setErrorUp] = useState(false);

  const fetchRecommended = async () => {
    setLoadingRec(true);
    setErrorRec(false);
    try {
      const res = await mediaApi.getRecommended();
      setRecommended(res.data);
    } catch {
      setErrorRec(true);
    } finally {
      setLoadingRec(false);
    }
  };

  const fetchForYou = async () => {
    setLoadingFY(true);
    setErrorFY(false);
    try {
      const res = await mediaApi.getForYou();
      setForYou(res.data);
    } catch {
      setErrorFY(true);
    } finally {
      setLoadingFY(false);
    }
  };

  const fetchUpcoming = async () => {
    setLoadingUp(true);
    setErrorUp(false);
    try {
      const res = await mediaApi.getUpcoming();
      setUpcoming(res.data);
    } catch {
      setErrorUp(true);
    } finally {
      setLoadingUp(false);
    }
  };

  useEffect(() => {
  const loadData = async () => {
    try {
      const [rec, fy, up] = await Promise.all([
        mediaApi.getRecommended(),
        mediaApi.getForYou(),
        mediaApi.getUpcoming(),
      ]);

      setRecommended(rec.data);
      setForYou(fy.data);
      setUpcoming(up.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRec(false);
      setLoadingFY(false);
      setLoadingUp(false);
    }
  };

  loadData();
}, []);

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "music", label: "Âm nhạc" },
    { key: "podcast", label: "Podcasts" },
  ] as const;

  return (
    <>
      {/* shimmer keyframe */}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <main
        style={{
          background: "linear-gradient(180deg, #1a1a2e 0%, #121212 300px)",
          height: "100%",
          color: "#fff",
          fontFamily:
            "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "24px",
          scrollbarWidth: "thin",
          scrollbarColor: "#555 transparent",
        }}
      >
        {/* Tab Bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? "#fff" : "#2a2a2a",
                color: activeTab === tab.key ? "#000" : "#fff",
                border: "none",
                borderRadius: "500px",
                padding: "6px 16px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s, transform 0.1s",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = "#3a3a3a";
                  e.currentTarget.style.transform = "scale(1.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = "#2a2a2a";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Play Grid — recommended */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          {loadingRec ?
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : errorRec ?
            <div style={{ gridColumn: "1/-1" }}>
              <ErrorMsg onRetry={fetchRecommended} />
            </div>
          : recommended
              .slice(0, 8)
              .map((track) => <QuickPlayCard key={track.id} track={track} />)
          }
        </div>

        {/* Section: Sắp ra mắt */}
        <section style={{ marginBottom: "32px" }}>
          <SectionHeader
            title="Lưu trước bản phát hành sắp ra mắt"
            onShowAll={() => {}}
          />
          <div style={{ display: "flex", gap: "16px" }}>
            {loadingUp ?
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ width: "200px", flexShrink: 0 }}>
                  <SkeletonCard height={220} />
                </div>
              ))
            : errorUp ?
              <ErrorMsg onRetry={fetchUpcoming} />
            : upcoming.map((track) => (
                <div key={track.id} style={{ width: "200px", flexShrink: 0 }}>
                  <AlbumCardLarge track={track} />
                </div>
              ))
            }
          </div>
        </section>

        {/* Section: Dành Cho Bạn */}
        <section style={{ marginBottom: "32px" }}>
          <SectionHeader label="Dành Cho" title="Bạn" onShowAll={() => {}} />
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollbarWidth: "thin",
              scrollbarColor: "#555 transparent",
            }}
          >
            {loadingFY ?
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ minWidth: "180px", flex: "0 0 180px" }}>
                  <SkeletonCard height={220} />
                </div>
              ))
            : errorFY ?
              <ErrorMsg onRetry={fetchForYou} />
            : forYou.map((track) => (
                <div
                  key={track.id}
                  style={{ minWidth: "180px", flex: "0 0 180px" }}
                >
                  <AlbumCardLarge track={track} />
                </div>
              ))
            }
          </div>
        </section>
      </main>
    </>
  );
};

export default MainContent;
