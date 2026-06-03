import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { playlistApi } from "../../api/playlistApi";
import type { Playlist } from "../../types/playlist";
import { ROUTES } from "../../constant/routes";

type FilterTab = "playlist" | "artist";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState<FilterTab | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal]   = useState("");
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [playlists, setPlaylists]   = useState<Playlist[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await playlistApi.getMyPlaylists();
        setPlaylists(res.data);
      } catch {
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = playlists.filter((item) => {
    const matchTab = activeTab === "artist" ? false : true; // playlists only for now
    const matchSearch = item.name.toLowerCase().includes(searchVal.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <aside
      style={{
        width: "280px",
        minWidth: "280px",
        background: "#121212",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#b3b3b3">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
            </svg>
            <span
              style={{
                color: "#b3b3b3",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
            >
              Thư viện
            </span>
          </div>

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
            }}
            title="Tạo playlist"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
              (e.currentTarget as HTMLButtonElement).style.background = "#2a2a2a";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#b3b3b3";
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
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
              }}
            >
              {tab === "playlist" ? "Danh sách phát" : "Nghệ sĩ"}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Sort */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 16px 8px",
          gap: "8px",
        }}
      >
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
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
            }}
          />
        )}

        <button
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
        >
          Gần đây
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
          </svg>
        </button>
      </div>

      {/* Playlist List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#555 transparent",
          padding: "0 8px 8px",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "24px",
              color: "#b3b3b3",
              fontSize: "13px",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid #333",
                borderTop: "2px solid #1DB954",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              color: "#b3b3b3",
              fontSize: "13px",
            }}
          >
            Chưa có dữ liệu
          </div>
        ) : (
          filtered.map((playlist) => (
            <PlaylistRow
              key={playlist.id}
              playlist={playlist}
              active={activeItem === playlist.id}
              onClick={() => {
                setActiveItem(playlist.id);
                navigate(ROUTES.PLAYLIST(playlist.id));
              }}
            />
          ))
        )}
      </div>
    </aside>
  );
};

// ─── PlaylistRow ──────────────────────────────────────────────────────────────
const PlaylistRow = ({
  playlist,
  active,
  onClick,
}: {
  playlist: Playlist;
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
      {/* Cover */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "4px",
          background: "#2a2a2a",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          "🎵"
        )}
      </div>

      {/* Info */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            color: active ? "#1DB954" : "#fff",
            fontSize: "14px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {playlist.name}
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
          Danh sách phát • {playlist.trackCount} bài
        </div>
      </div>
    </div>
  );
};

export default Sidebar;