<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
=======
import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

>>>>>>> origin/vinh-branch
import { playlistApi } from "../../api/playlistApi";
import type { Playlist } from "../../types/playlist";
import type { Media } from "../../types/media";
import { ROUTES } from "../../constant/routes";
<<<<<<< HEAD
import CreatePlaylistModal from "../playlist/CreatePlaylistModal";
import { usePlayer } from "../../hooks/usePlayer";
import { useHistoryStore } from "../../store/historyStore";

type FilterTab = "playlist" | "artist";
=======

import CreatePlaylistModal from "../playlist/CreatePlaylistModal";
import { usePlayer } from "../../hooks/usePlayer";
import { useHistoryStore } from "../../store/historyStore";
import { useFavorite } from "../../hooks/useFavorite";
import { authStore } from "../../store/authStore";

type FilterTab = "playlist" | "favorite" | "following";
>>>>>>> origin/vinh-branch

interface SidebarProps {
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggleCollapse: () => void;
  onToggleExpand: () => void;
}

<<<<<<< HEAD
// FIX: hỗ trợ cả field FE và field BE
const getPlaylistId = (playlist: Playlist) => {
  return playlist.id ?? playlist.playlistID ?? 0;
};

const getPlaylistName = (playlist: Playlist) => {
  return playlist.name ?? playlist.playlistName ?? "Playlist chưa có tên";
};

const getPlaylistTrackCount = (playlist: Playlist) => {
  return playlist.trackCount ?? playlist.tracks?.length ?? 0;
};

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
=======
const getPlaylistId = (playlist: Playlist) =>
  playlist.id ?? playlist.playlistID ?? 0;

const getPlaylistName = (playlist: Playlist) =>
  playlist.name ?? playlist.playlistName ?? "Playlist chưa có tên";

const getPlaylistTrackCount = (playlist: Playlist) =>
  playlist.trackCount ?? playlist.tracks?.length ?? 0;

>>>>>>> origin/vinh-branch
const Sidebar = ({
  isCollapsed,
  isExpanded,
  onToggleCollapse,
  onToggleExpand,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
  const isWide = isExpanded;

  const [activeTab, setActiveTab] = useState<FilterTab | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
=======
  const token = authStore((state) => state.token);
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  const canUseAuthApi = Boolean(token && isAuthenticated);

  const isWide = isExpanded;

  const [activeTab, setActiveTab] = useState<FilterTab>("playlist");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
>>>>>>> origin/vinh-branch
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const recentTracks = useHistoryStore((state) => state.recentTracks);
<<<<<<< HEAD
  const { playTrack, setQueue } = usePlayer();

  const fetchPlaylists = useCallback(async () => {
=======
  const { favoriteTracks, loadFavorites } = useFavorite();
  const { playTrack, setQueue } = usePlayer();

  const fetchPlaylists = useCallback(async () => {
    if (!canUseAuthApi) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

>>>>>>> origin/vinh-branch
    try {
      setLoading(true);

      const res = await playlistApi.getMyPlaylists();

<<<<<<< HEAD
      // BE trả { succes: true, data: [...] }
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);

      setPlaylists(data);
    } catch (err) {
      console.error("LOAD PLAYLISTS ERROR:", err);
=======
      const data: Playlist[] =
        Array.isArray(res.data) ? res.data
        : Array.isArray(res.data?.data) ? res.data.data
        : [];

      setPlaylists(data);
    } catch (error) {
      console.error("LOAD PLAYLISTS ERROR:", error);
>>>>>>> origin/vinh-branch
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const filteredPlaylists = playlists.filter((playlist) => {
    // Artist tab chưa có backend nên tạm thời ẩn playlist khi chọn artist
    if (activeTab === "artist") return false;

    const playlistName = getPlaylistName(playlist);

    return playlistName.toLowerCase().includes(searchVal.toLowerCase());
  });
=======
  }, [canUseAuthApi]);

  useEffect(() => {
    fetchPlaylists();

    if (canUseAuthApi) {
      loadFavorites();
    }
  }, [fetchPlaylists, loadFavorites, canUseAuthApi]);

  const filteredPlaylists = playlists.filter((playlist) =>
    getPlaylistName(playlist).toLowerCase().includes(searchVal.toLowerCase()),
  );

  const filteredFavorites = favoriteTracks.filter((track) =>
    track.title.toLowerCase().includes(searchVal.toLowerCase()),
  );
>>>>>>> origin/vinh-branch

  const handleOpenPlaylist = (playlist: Playlist) => {
    const playlistId = getPlaylistId(playlist);

    if (!playlistId) return;

    navigate(ROUTES.PLAYLIST(playlistId));
  };

<<<<<<< HEAD
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
=======
  const handleCreatePlaylist = () => {
    if (!canUseAuthApi) {
      navigate("/login");
      return;
    }

    setShowCreateModal(true);
  };

  const handleOpenFavoriteTab = () => {
    if (isCollapsed) onToggleCollapse();
    setActiveTab("favorite");
    setShowRecent(false);
  };

  const handlePlayTrackList = (track: Media, tracks: Media[]) => {
    setQueue(tracks);
    playTrack(track);
  };

  if (isCollapsed) {
    return (
      <aside style={collapsedAsideStyle}>
>>>>>>> origin/vinh-branch
        <IconBtn title="Mở thư viện" onClick={onToggleCollapse}>
          <LibraryIcon />
        </IconBtn>

<<<<<<< HEAD
        <IconBtn title="Tạo playlist" onClick={() => setShowCreateModal(true)}>
=======
        <IconBtn title="Tạo playlist" onClick={handleCreatePlaylist}>
>>>>>>> origin/vinh-branch
          <PlusIcon />
        </IconBtn>

        <IconBtn title="Phóng to thư viện" onClick={onToggleExpand}>
          <ExpandIcon />
        </IconBtn>

<<<<<<< HEAD
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
=======
        <div style={collapsedListStyle}>
          <SmallTile
            title="Bài hát yêu thích"
            active={activeTab === "favorite"}
            onClick={handleOpenFavoriteTab}
          >
            💚
          </SmallTile>

>>>>>>> origin/vinh-branch
          {playlists.map((playlist) => {
            const playlistId = getPlaylistId(playlist);
            const playlistName = getPlaylistName(playlist);

            return (
<<<<<<< HEAD
              <button
                key={playlistId}
                title={playlistName}
                onClick={() => handleOpenPlaylist(playlist)}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "10px",
                  border:
                    location.pathname === ROUTES.PLAYLIST(playlistId) ?
                      "2px solid #1DB954"
                    : "none",
                  background: "#2a2a2a",
                  overflow: "hidden",
                  cursor: "pointer",
                  color: "#fff",
                  flexShrink: 0,
                  padding: 0,
                }}
=======
              <SmallTile
                key={playlistId}
                title={playlistName}
                active={location.pathname === ROUTES.PLAYLIST(playlistId)}
                onClick={() => handleOpenPlaylist(playlist)}
>>>>>>> origin/vinh-branch
              >
                {playlist.coverUrl ?
                  <img
                    src={playlist.coverUrl}
                    alt={playlistName}
<<<<<<< HEAD
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                : <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg,#3a3a3a,#1a1a1a)",
                    }}
                  />
                }
              </button>
=======
                    style={imgFullStyle}
                  />
                : "🎵"}
              </SmallTile>
>>>>>>> origin/vinh-branch
            );
          })}
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
<<<<<<< HEAD
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
        position: isWide ? "absolute" : "relative",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: isWide ? 100 : 1,
        boxShadow: isWide ? "12px 0 40px rgba(0,0,0,0.55)" : "none",
        transition: "width 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* HEADER */}
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
=======
        ...asideStyle,
        width: isWide ? "calc(100vw - 380px)" : "100%",
        position: isWide ? "absolute" : "relative",
        zIndex: isWide ? 100 : 1,
        boxShadow: isWide ? "12px 0 40px rgba(0,0,0,0.55)" : "none",
      }}
    >
      <div style={{ padding: isWide ? "16px 16px 12px" : "12px 12px 8px" }}>
        <div style={topRowStyle}>
          <div style={titleGroupStyle}>
>>>>>>> origin/vinh-branch
            <IconBtn title="Thu nhỏ thư viện" onClick={onToggleCollapse}>
              <LibraryIcon />
            </IconBtn>

<<<<<<< HEAD
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
=======
            <span style={libraryTitleStyle}>Thư viện</span>
          </div>

          <div style={actionGroupStyle}>
            <IconBtn title="Tạo playlist" onClick={handleCreatePlaylist}>
>>>>>>> origin/vinh-branch
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

<<<<<<< HEAD
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

      {/* SEARCH + RECENT */}
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
        <div
          style={{
            position: "relative",
            flex: "1 1 auto",
            minWidth: 0,
=======
        <div style={tabsStyle}>
          <TabButton
            active={activeTab === "playlist"}
            onClick={() => {
              setActiveTab("playlist");
              setShowRecent(false);
            }}
          >
            Danh sách phát
          </TabButton>

          <TabButton
            active={activeTab === "favorite"}
            onClick={handleOpenFavoriteTab}
          >
            Yêu thích
          </TabButton>
          <TabButton
            active={activeTab === "following"}
            onClick={() => {
              setActiveTab("following");
              setShowRecent(false);
            }}
          >
            Đang follow
          </TabButton>
        </div>
      </div>

      <div style={searchRowStyle}>
        <div
          style={{
            ...searchBoxStyle,
>>>>>>> origin/vinh-branch
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
<<<<<<< HEAD
            transition: "all .25s ease",
=======
>>>>>>> origin/vinh-branch
          }}
        >
          <button
            onClick={() => setSearchOpen((prev) => !prev)}
            title="Tìm kiếm"
<<<<<<< HEAD
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
=======
            style={searchIconButtonStyle}
>>>>>>> origin/vinh-branch
          >
            <SearchIcon />
          </button>

          {searchOpen && (
            <input
              autoFocus
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Tìm trong thư viện"
<<<<<<< HEAD
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
=======
              style={searchInputStyle}
>>>>>>> origin/vinh-branch
            />
          )}
        </div>

        <button
          onClick={() => setShowRecent((prev) => !prev)}
          title="Hiện bài hát gần đây"
          style={{
<<<<<<< HEAD
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
=======
            ...recentButtonStyle,
            background: showRecent ? "#2a2a2a" : "transparent",
            color: showRecent ? "#fff" : "#b3b3b3",
>>>>>>> origin/vinh-branch
          }}
        >
          Gần đây
          <SortIcon />
        </button>
      </div>

<<<<<<< HEAD
      {/* LIST */}
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
=======
      <div style={listStyle}>
        {!canUseAuthApi ?
          <LoginNotice onLogin={() => navigate("/login")} />
        : showRecent ?
          recentTracks.length === 0 ?
            <EmptyText text="Chưa có bài hát gần đây" />
          : recentTracks.map((track) => (
              <TrackRow
                key={`recent-${track.id}`}
                track={track}
                isWide={isWide}
                onClick={() => handlePlayTrackList(track, recentTracks)}
              />
            ))

        : activeTab === "following" ?
          <EmptyText text="Chưa có API lấy danh sách đang follow" />
        : activeTab === "favorite" ?
          filteredFavorites.length === 0 ?
            <EmptyText text="Chưa có bài hát yêu thích" />
          : filteredFavorites.map((track) => (
              <TrackRow
                key={`favorite-${track.id}`}
                track={track}
                isWide={isWide}
                onClick={() => handlePlayTrackList(track, favoriteTracks)}
>>>>>>> origin/vinh-branch
              />
            ))

        : loading ?
          <LoadingText />
        : filteredPlaylists.length === 0 ?
<<<<<<< HEAD
          <EmptyText
            text={
              activeTab === "artist" ?
                "Chưa có nghệ sĩ theo dõi"
              : "Chưa có dữ liệu"
            }
          />
=======
          <EmptyText text="Chưa có playlist" />
>>>>>>> origin/vinh-branch
        : filteredPlaylists.map((playlist) => {
            const playlistId = getPlaylistId(playlist);

            return (
              <PlaylistRow
                key={playlistId}
                playlist={playlist}
                active={location.pathname === ROUTES.PLAYLIST(playlistId)}
                isWide={isWide}
                onClick={() => handleOpenPlaylist(playlist)}
              />
            );
          })
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

<<<<<<< HEAD
/* ================= PLAYLIST ROW ================= */
=======
const LoginNotice = ({ onLogin }: { onLogin: () => void }) => (
  <div style={{ padding: "16px 12px", color: "#b3b3b3", fontSize: "13px" }}>
    <p style={{ marginBottom: "12px" }}>Đăng nhập để xem playlist.</p>
    <button
      onClick={onLogin}
      style={{
        border: "none",
        borderRadius: "999px",
        padding: "8px 14px",
        background: "#fff",
        color: "#000",
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      Đăng nhập
    </button>
  </div>
);

>>>>>>> origin/vinh-branch
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

  const playlistName = getPlaylistName(playlist);
  const trackCount = getPlaylistTrackCount(playlist);

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
<<<<<<< HEAD
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
=======
      <CoverBox size={isWide ? 64 : 48}>
>>>>>>> origin/vinh-branch
        {playlist.coverUrl ?
          <img
            src={playlist.coverUrl}
            alt={playlistName}
<<<<<<< HEAD
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        : <div
  style={{
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg,#3a3a3a,#1a1a1a)",
  }}
/>}
      </div>
=======
            style={imgFullStyle}
          />
        : "🎵"}
      </CoverBox>
>>>>>>> origin/vinh-branch

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
          {playlistName}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: isWide ? "13px" : "12px",
<<<<<<< HEAD
            marginTop: "3px",
=======
            marginTop: "4px",
>>>>>>> origin/vinh-branch
          }}
        >
          Danh sách phát • {trackCount} bài
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
/* ================= RECENT TRACK ROW ================= */
const RecentTrackRow = ({
=======
const TrackRow = ({
>>>>>>> origin/vinh-branch
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
<<<<<<< HEAD
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
=======
      <CoverBox size={isWide ? 56 : 48}>
>>>>>>> origin/vinh-branch
        {track.thumbnailUrl ?
          <img
            src={track.thumbnailUrl}
            alt={track.title}
<<<<<<< HEAD
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        : <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg,#3a3a3a,#1a1a1a)",
            }}
          />
        }
      </div>
=======
            style={imgFullStyle}
          />
        : "💚"}
      </CoverBox>
>>>>>>> origin/vinh-branch

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
<<<<<<< HEAD
            marginTop: "3px",
=======
            marginTop: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
>>>>>>> origin/vinh-branch
          }}
        >
          Bài hát • {track.artist?.name ?? "Unknown Artist"}
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
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
=======
const SmallTile = ({
  title,
  active,
  children,
  onClick,
}: {
  title: string;
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: "52px",
      height: "52px",
      borderRadius: "10px",
      border: active ? "2px solid #1DB954" : "none",
      background: "#2a2a2a",
      overflow: "hidden",
      cursor: "pointer",
      color: "#fff",
      flexShrink: 0,
      padding: 0,
      fontSize: "20px",
    }}
  >
    {children}
  </button>
);

const CoverBox = ({
  size,
  children,
}: {
  size: number;
  children: ReactNode;
}) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "8px",
      background: "linear-gradient(135deg,#3a3a3a,#1a1a1a)",
      overflow: "hidden",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "22px",
    }}
  >
    {children}
  </div>
);

const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      background: active ? "#fff" : "#2a2a2a",
      color: active ? "#000" : "#fff",
      border: "none",
      borderRadius: "500px",
      padding: "6px 14px",
      fontSize: "13px",
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

const IconBtn = ({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
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
  >
    {children}
  </button>
);

const EmptyText = ({ text }: { text: string }) => (
  <div
    style={{
      color: "#b3b3b3",
      fontSize: "13px",
      padding: "16px 10px",
      textAlign: "center",
>>>>>>> origin/vinh-branch
    }}
  >
    {text}
  </div>
);

<<<<<<< HEAD
=======
const LoadingText = () => (
  <div style={{ color: "#b3b3b3", fontSize: "13px", padding: "16px 10px" }}>
    Đang tải...
  </div>
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

const asideStyle: CSSProperties = {
  minWidth: 0,
  height: "100%",
  background: "#121212",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
  left: 0,
  top: 0,
  bottom: 0,
  transition: "width 0.25s ease, box-shadow 0.25s ease",
};

const collapsedAsideStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: 0,
  background: "#121212",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "12px 8px",
  gap: "10px",
  overflow: "hidden",
  boxSizing: "border-box",
};

const collapsedListStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  scrollbarWidth: "thin",
  scrollbarColor: "#555 transparent",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  minWidth: 0,
  marginBottom: "14px",
};

const titleGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
};

const libraryTitleStyle: CSSProperties = {
  color: "#b3b3b3",
  fontSize: "15px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const actionGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexShrink: 0,
};

const tabsStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  overflowX: "hidden",
  flexWrap: "wrap",
};

const searchRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "4px 12px 8px",
  gap: "8px",
  minWidth: 0,
  overflowX: "hidden",
};

const searchBoxStyle: CSSProperties = {
  position: "relative",
  flex: "1 1 auto",
  minWidth: 0,
  transition: "all .25s ease",
};

const searchIconButtonStyle: CSSProperties = {
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
};

const searchInputStyle: CSSProperties = {
  width: "100%",
  height: "36px",
  background: "#2a2a2a",
  border: "none",
  outline: "none",
  borderRadius: "500px",
  padding: "0 10px 0 38px",
  color: "#fff",
  fontSize: "13px",
  boxSizing: "border-box",
};

const recentButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: "999px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontSize: "13px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  flexShrink: 0,
  padding: "8px 10px",
};
const listStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  scrollbarWidth: "thin",
  scrollbarColor: "#555 transparent",
  padding: "0 8px 8px",
};

const imgFullStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

>>>>>>> origin/vinh-branch
export default Sidebar;
