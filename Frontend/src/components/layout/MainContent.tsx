import { useState } from "react";
import { usePlayer } from "../../hooks/usePlayer";
// ─── Types ────────────────────────────────────────────────────────────────────
interface QuickPlayItem {
  id: number;
  title: string;
  color: string;
  emoji: string;
}

interface AlbumCard {
  id: number;
  title: string;
  artist: string;
  color: string;
  tag?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const quickItems: QuickPlayItem[] = [
  {
    id: 1,
    title: "Nhạc Remix HOT TIKTOK 2026...",
    color: "#1a3a5c",
    emoji: "🎧",
  },
  { id: 2, title: "Thiên Hạ Nghe Gì", color: "#2d4a1e", emoji: "🎵" },
  { id: 3, title: "HIEUTHUHAI", color: "#2a2a2a", emoji: "🎤" },
  { id: 4, title: "Exit Sign Radio", color: "#3d1f1f", emoji: "📻" },
  {
    id: 5,
    title: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    color: "#1a2a3d",
    emoji: "✨",
  },
  { id: 6, title: "Mắt Nhắm Mắt Mở", color: "#2d1f3d", emoji: "🌙" },
  { id: 7, title: "Hà Anh Tuấn Radio", color: "#1f3d2d", emoji: "🎶" },
  { id: 8, title: "Nhạc đi chill đi phượt", color: "#3d2d1f", emoji: "🏕️" },
];

const upcomingCards: AlbumCard[] = [
  {
    id: 1,
    title: "Nhắc Máy",
    artist: "Noo Phước Thịnh",
    color: "#1a3050",
    tag: "NHẮC MÁY",
  },
];

const forYouCards: AlbumCard[] = [
  { id: 1, title: "Thiên Hạ Nghe Gì", artist: "Spotify", color: "#1db954" },
  {
    id: 2,
    title: "Hà Anh Tuấn Radio",
    artist: "Hà Anh Tuấn",
    color: "#c0392b",
  },
  {
    id: 3,
    title: "Mắt Nhắm Mắt Mở",
    artist: "Nhiều nghệ sĩ",
    color: "#8e44ad",
  },
  { id: 4, title: "HIEUTHUHAI Mix", artist: "HIEUTHUHAI", color: "#2c3e50" },
  { id: 5, title: "Nhạc Chill Buổi Sáng", artist: "Spotify", color: "#16a085" },
  { id: 6, title: "V-Pop Hits 2026", artist: "Spotify", color: "#d35400" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const PlayButton = () => (
  <button
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

const QuickPlayCard = ({ item }: { item: QuickPlayItem }) => {
  const [hovered, setHovered] = useState(false);
  const { setTrack } = usePlayer();
  const handlePlay = () => {
    setTrack({
      id: String(item.id),
      title: item.title,
      artist: "TuneVault",
      duration: 214,
      color: item.color,
      emoji: item.emoji,
    });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:
          hovered ?
            `linear-gradient(135deg, ${item.color}dd, ${item.color}99)`
          : `linear-gradient(135deg, ${item.color}bb, ${item.color}66)`,
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        gap: "0",
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
          background: `${item.color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
          boxShadow: "4px 0 12px rgba(0,0,0,0.3)",
        }}
      >
        {item.emoji}
      </div>

      {/* Title */}
      <span
        style={{
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          padding: "0 12px",
          flex: 1,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        {item.title}
      </span>

      {/* Play button — shown on hover */}
      <div
        style={{
          position: "absolute",
          right: "12px",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.2s, transform 0.2s",
        }}
        onClick={handlePlay}
      >
        <PlayButton />
      </div>
    </div>
  );
};

const AlbumCardLarge = ({ card }: { card: AlbumCard }) => {
  const [hovered, setHovered] = useState(false);
  const { setTrack } = usePlayer();

  const handlePlay = () => {
    setTrack({
      id: String(card.id),
      title: card.title,
      artist: card.artist,
      duration: 240,
      color: card.color,
      emoji: "🎵",
    });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#181818",
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        transition: "background 0.2s ease",
        position: "relative",
        minWidth: "180px",
      }}
    >
      {/* Cover Art */}
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          borderRadius: "4px",
          background: `linear-gradient(135deg, ${card.color}, ${card.color}88)`,
          position: "relative",
          marginBottom: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {/* Decorative art */}
        <div
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
            {card.tag || card.title}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
            {card.artist}
          </div>
        </div>

        {/* Play button on hover */}
        <div
          onClick={handlePlay}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.2s, transform 0.2s",
          }}
        >
          <PlayButton />
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
        {card.title}
      </div>
      <div style={{ color: "#b3b3b3", fontSize: "12px" }}>{card.artist}</div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const MainContent = () => {
  const [activeTab, setActiveTab] = useState<"all" | "music" | "podcast">(
    "all",
  );

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "music", label: "Âm nhạc" },
    { key: "podcast", label: "Podcasts" },
  ] as const;

  return (
    <main
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #121212 300px)",
        height: "100%", // ← đổi từ 100vh thành 100%
        color: "#fff",
        fontFamily:
          "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "24px 24px 24px", // ← bỏ padding-bottom 80px
        scrollbarWidth: "thin" as const,
        scrollbarColor: "#555 transparent",
      }}
    >
      {/* ── Tab Bar ── */}
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

      {/* ── Quick Play Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          marginBottom: "32px",
        }}
      >
        {quickItems.map((item) => (
          <QuickPlayCard key={item.id} item={item} />
        ))}
      </div>

      {/* ── Section: Sắp ra mắt ── */}
      <section style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Lưu trước bản phát hành sắp ra mắt
          </h2>
          <button
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
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {upcomingCards.map((card) => (
            <div key={card.id} style={{ width: "200px" }}>
              <AlbumCardLarge card={card} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Dành Cho ── */}
      <section style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <div>
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
              Dành Cho
            </p>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              Phan Ngọc Vinh
            </h2>
          </div>
          <button
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
        </div>

        {/* Scrollable row */}
        <div
          style={{
            display: "flex", // ← đổi từ grid sang flex
            gap: "16px",
            overflowX: "auto", // ← scroll ngang
            paddingBottom: "8px",
            scrollbarWidth: "thin" as const,
            scrollbarColor: "#555 transparent",
          }}
        >
          {forYouCards.map((card) => (
            <div key={card.id} style={{ minWidth: "180px", flex: "0 0 180px" }}>
              {" "}
              {/* ← cố định width */}
              <AlbumCardLarge key={card.id} card={card} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MainContent;
