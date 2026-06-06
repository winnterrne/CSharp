import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { playlistApi } from "../../api/playlistApi";
import type { Playlist } from "../../types/playlist";
import type { Media } from "../../types/media";
import { ROUTES } from "../../constant/routes";
import CreatePlaylistModal from "../playlist/CreatePlaylistModal";
import { usePlayer } from "../../hooks/usePlayer";
import { useHistoryStore } from "../../store/historyStore";
import { useLocation } from "react-router-dom";

type FilterTab = "playlist" | "artist";

interface SidebarProps {
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggleCollapse: () => void;
  onToggleExpand: () => void;
}

/* ================= ICON BUTTON ================= */
const IconBtn = ({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: "42px",
      height: "42px",
      minWidth: "42px",
      minHeight: "42px",
      borderRadius: "50%",
      border: "none",
      background: "transparent",
      color: "#b3b3b3",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#2a2a2a";
      e.currentTarget.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "#b3b3b3";
    }}
  >
    {children}
  </button>
);

const LibraryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm4-4h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm1 3v10h10V5H9z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5h6v2H8.41l4.3 4.29-1.42 1.42L7 8.41V11H5V5zm14 0v6h-2V8.41l-4.29 4.3-1.42-1.42L15.59 7H13V5h6zM5 19v-6h2v2.59l4.29-4.3 1.42 1.42L8.41 17H11v2H5zm14 0h-6v-2h2.59l-4.3-4.29 1.42-1.42L17 15.59V13h2v6z" />
  </svg>
);

// const CollapseIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
//   </svg>
// );

// const OpenIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
//     <path d="m8.59 16.59 1.41 1.41 6-6-6-6-1.41 1.41L13.17 12z" />
//   </svg>
// );

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.5 3a7.5 7.5 0 1 0 4.74 13.32l4.22 4.22a1 1 0 0 0 1.42-1.42l-4.22-4.22A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Z" />
  </svg>
);

const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
  </svg>
);

/* ================= SIDEBAR ================= */
const Sidebar = ({
  isCollapsed,
  isExpanded,
  onToggleCollapse,
  onToggleExpand,
}: SidebarProps) => {
  const navigate = useNavigate();

  // EXPANDED MODE FLAG
  const isWide = isExpanded;

  const [activeTab, setActiveTab] = useState<FilterTab | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  // MODAL CREATE PLAYLIST
  const [showCreateModal, setShowCreateModal] = useState(false);

  // RECENT TRACKS LOCAL STORAGE
  const [showRecent, setShowRecent] = useState(false);
  const recentTracks = useHistoryStore((state) => state.recentTracks);

  // PLAYER ACTIONS
  const { playTrack, setQueue } = usePlayer();
  const location = useLocation();
  /* ================= FETCH PLAYLISTS ================= */
  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      const res = await playlistApi.getMyPlaylists();

      setPlaylists(Array.isArray(res.data) ? res.data : (res.data?.data ?? []));
    } catch {
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  /* ================= FILTER PLAYLISTS ================= */
  const filteredPlaylists = playlists.filter((item) => {
    const matchTab = true;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchVal.toLowerCase());

    return matchTab && matchSearch;
  });

  /* ================= COLLAPSED SIDEBAR ================= */
  if (isCollapsed) {
    return (
      <aside
        style={{
          width: "100%",
          height: "100%",
          background: "#121212",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "12px 8px",
          gap: "10px",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <IconBtn title="Mở thư viện" onClick={onToggleCollapse}>
          <LibraryIcon />
        </IconBtn>

        <IconBtn title="Tạo playlist" onClick={() => setShowCreateModal(true)}>
          <PlusIcon />
        </IconBtn>

        <IconBtn title="Phóng to thư viện" onClick={onToggleExpand}>
          <ExpandIcon />
        </IconBtn>

        <div
          style={{
            flex: 1,
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            scrollbarWidth: "none",
          }}
        >
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              title={playlist.name}
              onClick={() => {
                setActiveItem(playlist.id);
                navigate(ROUTES.PLAYLIST(playlist.id));
              }}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "10px",
                border:
                  activeItem === playlist.id ? "2px solid #1DB954" : "none",
                background: "#2a2a2a",
                overflow: "hidden",
                cursor: "pointer",
                color: "#fff",
                flexShrink: 0,
                padding: 0,
              }}
            >
              {playlist.coverUrl ?
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              : "🎵"}
            </button>
          ))}
        </div>

        <CreatePlaylistModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchPlaylists}
        />
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: isWide ? "calc(100vw - 380px)" : "100%",
        minWidth: 0,
        height: "100%",
        background:
          isWide ?
            "linear-gradient(180deg, #181818 0%, #121212 100%)"
          : "#121212",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",

        // EXPANDED: sidebar đè lên MainContent
        position: isWide ? "absolute" : "relative",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: isWide ? 100 : 1,
        boxShadow: isWide ? "12px 0 40px rgba(0,0,0,0.55)" : "none",
        transition: "width 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          padding: isWide ? "16px 16px 12px" : "12px 12px 8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            minWidth: 0,
            marginBottom: isWide ? "18px" : "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              minWidth: 0,
            }}
          >
            <IconBtn title="Thu nhỏ thư viện" onClick={onToggleCollapse}>
              <LibraryIcon />
            </IconBtn>

            <span
              style={{
                color: "#b3b3b3",
                fontSize: isWide ? "16px" : "15px",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Thư viện
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <IconBtn
              title="Tạo playlist"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusIcon />
            </IconBtn>

            <IconBtn
              title={isWide ? "Thu về bình thường" : "Phóng to thư viện"}
              onClick={onToggleExpand}
            >
              <ExpandIcon />
            </IconBtn>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          {(["playlist", "artist"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(activeTab === tab ? null : tab)}
              style={{
                background: activeTab === tab ? "#fff" : "#2a2a2a",
                color: activeTab === tab ? "#000" : "#fff",
                border: "none",
                borderRadius: "500px",
                padding: isWide ? "7px 18px" : "6px 14px",
                fontSize: isWide ? "14px" : "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab === "playlist" ? "Danh sách phát" : "Nghệ sĩ"}
            </button>
          ))}
        </div>
      </div>

      {/* ================= SEARCH + RECENT ================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isWide ? "6px 16px 12px" : "4px 12px 8px",
          gap: isWide ? "12px" : "8px",
          minWidth: 0,
        }}
      >
        {/* Search box */}
        <div
          style={{
            position: "relative",
            flex: "1 1 auto",
            minWidth: 0,
            width:
              searchOpen ?
                isWide ? "100%"
                : "170px"
              : "42px",
            maxWidth:
              searchOpen ?
                isWide ? "360px"
                : "170px"
              : "42px",
            transition: "all .25s ease",
          }}
        >
          <button
            onClick={() => setSearchOpen((prev) => !prev)}
            title="Tìm kiếm"
            style={{
              position: "absolute",
              left: "9px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "24px",
              height: "24px",
              border: "none",
              background: "transparent",
              color: "#b3b3b3",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <SearchIcon />
          </button>

          {searchOpen && (
            <input
              autoFocus
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Tìm trong thư viện"
              style={{
                width: "100%",
                height: isWide ? "38px" : "36px",
                background: "#2a2a2a",
                border: "none",
                outline: "none",
                borderRadius: "500px",
                padding: "0 10px 0 38px",
                color: "#fff",
                fontSize: isWide ? "14px" : "13px",
                boxSizing: "border-box",
              }}
            />
          )}
        </div>

        {/* Recent toggle */}
        <button
          onClick={() => setShowRecent((prev) => !prev)}
          title="Hiện bài hát gần đây"
          style={{
            background: showRecent ? "#2a2a2a" : "transparent",
            border: "none",
            borderRadius: "999px",
            color: showRecent ? "#fff" : "#b3b3b3",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: isWide ? "14px" : "13px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            flexShrink: 0,
            minWidth: isWide ? "108px" : "auto",
            padding: isWide ? "9px 16px" : "8px 10px",
          }}
        >
          Gần đây
          <SortIcon />
        </button>
      </div>

      {/* ================= LIST AREA ================= */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#555 transparent",
          padding: isWide ? "0 16px 16px" : "0 8px 8px",
        }}
      >
        {showRecent ?
          recentTracks.length === 0 ?
            <EmptyText text="Chưa có bài hát gần đây" />
          : recentTracks.map((track) => (
              <RecentTrackRow
                key={track.id}
                track={track}
                isWide={isWide}
                onClick={() => {
                  setQueue(recentTracks);
                  playTrack(track);
                }}
              />
            ))

        : loading ?
          <LoadingText />
        : filteredPlaylists.length === 0 ?
          <EmptyText text="Chưa có dữ liệu" />
        : filteredPlaylists.map((playlist) => (
            <PlaylistRow
              key={playlist.id}
              playlist={playlist}
              active={location.pathname === ROUTES.PLAYLIST(playlist.id)}
              isWide={isWide}
              onClick={() => {
                setActiveItem(playlist.id);
                navigate(ROUTES.PLAYLIST(playlist.id));
              }}
            />
          ))
        }
      </div>

      <CreatePlaylistModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchPlaylists}
      />
    </aside>
  );
};

/* ================= PLAYLIST ROW ================= */
const PlaylistRow = ({
  playlist,
  active,
  isWide,
  onClick,
}: {
  playlist: Playlist;
  active: boolean;
  isWide: boolean;
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
        gap: isWide ? "16px" : "12px",
        padding: isWide ? "12px" : "8px",
        borderRadius: "8px",
        background:
          active ? "#2a2a2a"
          : hovered ? "#1a1a1a"
          : "transparent",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: isWide ? "64px" : "48px",
          height: isWide ? "64px" : "48px",
          borderRadius: isWide ? "8px" : "6px",
          background: "#2a2a2a",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isWide ? "24px" : "20px",
        }}
      >
        {playlist.coverUrl ?
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        : "🎵"}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            color: active ? "#1DB954" : "#fff",
            fontSize: isWide ? "15px" : "14px",
            fontWeight: 700,
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
            fontSize: isWide ? "13px" : "12px",
            marginTop: "3px",
          }}
        >
          Danh sách phát • {playlist.trackCount} bài
        </div>
      </div>
    </div>
  );
};

/* ================= RECENT TRACK ROW ================= */
const RecentTrackRow = ({
  track,
  isWide,
  onClick,
}: {
  track: Media;
  isWide: boolean;
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
        gap: isWide ? "16px" : "12px",
        padding: isWide ? "12px" : "8px",
        borderRadius: "8px",
        background: hovered ? "#1a1a1a" : "transparent",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: isWide ? "64px" : "48px",
          height: isWide ? "64px" : "48px",
          borderRadius: isWide ? "8px" : "6px",
          background: "#2a2a2a",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {track.thumbnailUrl ?
          <img
            src={track.thumbnailUrl}
            alt={track.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        : "🎵"}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            color: "#fff",
            fontSize: isWide ? "15px" : "14px",
            fontWeight: 700,
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
            fontSize: isWide ? "13px" : "12px",
            marginTop: "3px",
          }}
        >
          Bài hát • {track.artist.name}
        </div>
      </div>
    </div>
  );
};

/* ================= STATES ================= */
const LoadingText = () => (
  <div style={{ padding: "24px", color: "#b3b3b3", fontSize: "13px" }}>
    Đang tải...
  </div>
);

const EmptyText = ({ text }: { text: string }) => (
  <div
    style={{
      textAlign: "center",
      padding: "24px",
      color: "#b3b3b3",
      fontSize: "13px",
    }}
  >
    {text}
  </div>
);

export default Sidebar;
