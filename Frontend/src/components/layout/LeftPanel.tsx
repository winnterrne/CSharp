import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterTab = "playlist" | "artist";

interface LibraryItem {
  id: number;
  name: string;
  type: "playlist" | "artist";
  sub: string;
  emoji: string;
  color: string;
  pinned?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const libraryItems: LibraryItem[] = [
  {
    id: 1,
    name: "Bài hát đã thích",
    type: "playlist",
    sub: "Danh sách phát • 11 bài hát",
    emoji: "💜",
    color: "#4a1d8a",
    pinned: true,
  },
  {
    id: 2,
    name: "HIEUTHUHAI",
    type: "artist",
    sub: "Nghệ sĩ",
    emoji: "🎤",
    color: "#2a2a2a",
  },
  {
    id: 3,
    name: "marzuz",
    type: "artist",
    sub: "Nghệ sĩ",
    emoji: "🎧",
    color: "#3a2a4a",
  },
  {
    id: 4,
    name: "Nhạc của Vinh",
    type: "playlist",
    sub: "Danh sách phát • Phan Ngọc Vinh",
    emoji: "🎵",
    color: "#1a3a5c",
  },
  {
    id: 5,
    name: "CAPTAIN BOY",
    type: "artist",
    sub: "Nghệ sĩ",
    emoji: "🎸",
    color: "#1f2a1f",
  },
  {
    id: 6,
    name: "Đức Phúc",
    type: "artist",
    sub: "Nghệ sĩ",
    emoji: "🎙️",
    color: "#3a3a2a",
  },
  {
    id: 7,
    name: "JustaTee",
    type: "artist",
    sub: "Nghệ sĩ",
    emoji: "🎶",
    color: "#2a3a2a",
  },
  {
    id: 8,
    name: "Ngày Rời Chuyến Bay",
    type: "playlist",
    sub: "Minh Huy, Pinny",
    emoji: "✈️",
    color: "#2a3a4a",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState<FilterTab | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [activeItem, setActiveItem] = useState(8); // Ngày Rời Chuyến Bay active

  const filtered = libraryItems.filter((item) => {
    const matchTab = activeTab ? item.type === activeTab : true;
    const matchSearch = item.name.toLowerCase().includes(searchVal.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <aside
      style={{
        width: "280px",
        minWidth: "280px",
        background: "linear-gradient(180deg, #1a1a2e 0%, #121212 300px)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        height: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Library icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#b3b3b3">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
            </svg>
            <span
              style={{
                color: "#b3b3b3",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
            >
              Thư viện
            </span>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            {/* Add button */}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#b3b3b3",
                cursor: "pointer",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.15s, background 0.15s",
              }}
              title="Tạo danh sách phát hoặc thư mục"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "#2a2a2a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#b3b3b3";
                e.currentTarget.style.background = "none";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
            {/* Expand arrow */}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#b3b3b3",
                cursor: "pointer",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.15s, background 0.15s",
              }}
              title="Hiển thị thêm"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "#2a2a2a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#b3b3b3";
                e.currentTarget.style.background = "none";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          {(["playlist", "artist"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(activeTab === tab ? null : tab)}
              style={{
                background: activeTab === tab ? "#fff" : "#2a2a2a",
                color: activeTab === tab ? "#000" : "#fff",
                border: "none",
                borderRadius: "500px",
                padding: "5px 14px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) e.currentTarget.style.background = "#3a3a3a";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) e.currentTarget.style.background = "#2a2a2a";
              }}
            >
              {tab === "playlist" ? "Danh sách phát" : "Nghệ sĩ"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search + Sort bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 16px 8px",
          gap: "8px",
        }}
      >
        {/* Search icon / input */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            borderRadius: "4px",
            transition: "color 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
          title="Tìm kiếm trong thư viện"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>

        {searchOpen && (
          <input
            autoFocus
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Tìm trong thư viện"
            style={{
              flex: 1,
              background: "#2a2a2a",
              border: "none",
              outline: "none",
              borderRadius: "4px",
              padding: "6px 10px",
              color: "#fff",
              fontSize: "13px",
              caretColor: "#1DB954",
            }}
          />
        )}

        {/* Sort */}
        <button
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "4px",
            transition: "color 0.15s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
          title="Sắp xếp"
        >
          Gần đây
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
          </svg>
        </button>
      </div>

      {/* ── Library List ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin" as const,
          scrollbarColor: "#555 transparent",
          padding: "0 8px 8px",
        }}
      >
        {filtered.map((item) => (
          <LibraryRow
            key={item.id}
            item={item}
            active={activeItem === item.id}
            onClick={() => setActiveItem(item.id)}
          />
        ))}
      </div>
    </aside>
  );
};

// ─── Library Row ──────────────────────────────────────────────────────────────
const LibraryRow = ({
  item,
  active,
  onClick,
}: {
  item: LibraryItem;
  active: boolean;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px",
        borderRadius: "6px",
        background: active ? "#2a2a2a" : hovered ? "#1a1a1a" : "transparent",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: item.type === "artist" ? "50%" : "4px",
          background: item.pinned
            ? "linear-gradient(135deg, #4a1d8a, #1DB954)"
            : `linear-gradient(135deg, ${item.color}, ${item.color}88)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          flexShrink: 0,
          boxShadow: active ? "0 4px 12px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {item.pinned ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </svg>
        ) : (
          item.emoji
        )}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            color: active ? "#1DB954" : "#fff",
            fontSize: "14px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "-0.01em",
            transition: "color 0.15s",
          }}
        >
          {item.name}
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
          {item.sub}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;