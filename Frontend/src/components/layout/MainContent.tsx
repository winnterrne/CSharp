import { useState, useEffect, useCallback } from "react";
import { usePlayer } from "../../hooks/usePlayer";
import type { Media } from "../../types/media";
import { mockTracks } from "../../data/mockTracks";
import {
  mockRecommended,
  mockForYou,
  mockUpcoming,
} from "../../data/mockMedia";

const getThumb = (track: Media) => track.thumbnailUrl ?? null;

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

const QuickPlayCard = ({
  track,
  tracks,
}: {
  track: Media;
  tracks: Media[];
}) => {
  const [hovered, setHovered] = useState(false);
  const { playTrack, setQueue } = usePlayer();
  const thumb = getThumb(track);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#2a2a2a" : "#181818",
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
      <div
        style={{
          width: "56px",
          height: "56px",
          background: "#2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
          boxShadow: "4px 0 12px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={track.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          "🎵"
        )}
      </div>

      <span
        style={{
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          padding: "0 12px",
          flex: 1,
          lineHeight: 1.3,
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
        {/* QUEUE */}
        <PlayButton
          onClick={(e) => {
            e.stopPropagation();
            setQueue(tracks);
            playTrack(track);
          }}
        />
      </div>
    </div>
  );
};

const AlbumCardLarge = ({
  track,
  tracks,
}: {
  track: Media;
  tracks: Media[];
}) => {
  const [hovered, setHovered] = useState(false);
  const { playTrack, setQueue } = usePlayer();
  const thumb = getThumb(track);

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
      }}
    >
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          borderRadius: "4px",
          background: "#2a2a2a",
          position: "relative",
          marginBottom: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {thumb ? (
          <img
            src={thumb}
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
              fontSize: "40px",
            }}
          >
            🎵
          </div>
        )}

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
          {/* QUEUE */}
          <PlayButton
            onClick={(e) => {
              e.stopPropagation();
              setQueue(tracks);
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

      <div style={{ color: "#b3b3b3", fontSize: "12px" }}>
        {track.artist.name}
      </div>
    </div>
  );
};

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
      marginBottom: "16px",
    }}
  >
    <div>
      {label && (
        <p
          style={{
            color: "#b3b3b3",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "2px",
          }}
        >
          {label}
        </p>
      )}

      <h2
        style={{
          color: "#fff",
          fontSize: "22px",
          fontWeight: 700,
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

const MainContent = () => {
  const { playTrack, setQueue } = usePlayer();

  const [activeTab, setActiveTab] = useState<"all" | "music" | "podcast">(
    "all",
  );

  // NEW: quản lý màn hình hiện tất cả
  const [viewMode, setViewMode] = useState<
    "home" | "recommended" | "upcoming" | "forYou"
  >("home");

  const [recommended, setRecommended] = useState<Media[]>([]);
  const [forYou, setForYou] = useState<Media[]>([]);
  const [upcoming, setUpcoming] = useState<Media[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorRec, setErrorRec] = useState(false);
  const [errorFY, setErrorFY] = useState(false);
  const [errorUp, setErrorUp] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setErrorRec(false);
    setErrorFY(false);
    setErrorUp(false);

    // NEW: mock data khi chưa có backend
    setTimeout(() => {
      setRecommended(mockRecommended);
      setForYou(mockForYou);
      setUpcoming(mockUpcoming);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "music", label: "Âm nhạc" },
    { key: "podcast", label: "Podcasts" },
  ] as const;

  // NEW: dữ liệu cho màn hình hiện tất cả
  const getFullViewData = () => {
    if (viewMode === "recommended") {
      return {
        title: "Đề xuất cho bạn",
        tracks: recommended,
      };
    }

    if (viewMode === "upcoming") {
      return {
        title: "Bản phát hành sắp ra mắt",
        tracks: upcoming,
      };
    }

    if (viewMode === "forYou") {
      return {
        title: "Dành cho bạn",
        tracks: forYou,
      };
    }

    return {
      title: "",
      tracks: [],
    };
  };

  const fullViewData = getFullViewData();

  return (
    <>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <main
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "30px",
          paddingBottom: "120px",
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #1a1a2e 0%, #121212 300px)",
        }}
      >
        {/* NEW: màn hình hiện tất cả */}
        {viewMode !== "home" && (
          <>
            <button
              onClick={() => setViewMode("home")}
              style={{
                marginBottom: "20px",
                background: "#2a2a2a",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ← Quay lại
            </button>

            <SectionHeader title={fullViewData.title} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "16px",
              }}
            >
              {fullViewData.tracks.map((track) => (
                <AlbumCardLarge
                  key={track.id}
                  track={track}
                  tracks={fullViewData.tracks}
                />
              ))}
            </div>
          </>
        )}

        {/* NEW: home chỉ hiện khi chưa bấm hiện tất cả */}
        {viewMode === "home" && (
          <>
            <button
              onClick={() => {
                setQueue(mockTracks);
                playTrack(mockTracks[0]);
              }}
              style={{
                marginBottom: "16px",
                padding: "10px 16px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ▶ Test phát nhạc
            </button>

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
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.background = "#3a3a3a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.background = "#2a2a2a";
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <SectionHeader
              title="Đề xuất cho bạn"
              onShowAll={() => setViewMode("recommended")} // NEW
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "8px",
                marginBottom: "32px",
              }}
            >
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : errorRec ? (
                <div style={{ gridColumn: "1/-1" }}>
                  <ErrorMsg onRetry={fetchAll} />
                </div>
              ) : (
                recommended.slice(0, 8).map((track) => (
                  <QuickPlayCard
                    key={track.id}
                    track={track}
                    tracks={recommended}
                  />
                ))
              )}
            </div>

            <section style={{ marginBottom: "32px" }}>
              <SectionHeader
                title="Lưu trước bản phát hành sắp ra mắt"
                onShowAll={() => setViewMode("upcoming")} // NEW
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "16px",
                }}
              >
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonCard key={i} height={220} />
                  ))
                ) : errorUp ? (
                  <ErrorMsg onRetry={fetchAll} />
                ) : (
                  upcoming.slice(0, 5).map((track) => (
                    <AlbumCardLarge
                      key={track.id}
                      track={track}
                      tracks={upcoming}
                    />
                  ))
                )}
              </div>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <SectionHeader
                label="Dành Cho"
                title="Bạn"
                onShowAll={() => setViewMode("forYou")} // NEW
              />

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
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      style={{ minWidth: "180px", flex: "0 0 180px" }}
                    >
                      <SkeletonCard height={220} />
                    </div>
                  ))
                ) : errorFY ? (
                  <ErrorMsg onRetry={fetchAll} />
                ) : (
                  forYou.map((track) => (
                    <div
                      key={track.id}
                      style={{
                        minWidth: "160px",
                        maxWidth: "220px",
                        flex: "0 0 clamp(160px, 18vw, 220px)",
                      }}
                    >
                      <AlbumCardLarge track={track} tracks={forYou} />
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default MainContent;