import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import type { Media } from "../types/media";
import PlayerBar from "../components/layout/PlayerBar";
import Header from "../components/layout/Header";
import NowPlaying from "../components/layout/NowPlaying";

import { usePlayer } from "../hooks/usePlayer";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../hooks/useSearch";

import NotificationSignalRListener from "../pages/Notification/NotificationSignalRListener";

const MIN_SIDEBAR_WIDTH = 80;
const DEFAULT_SIDEBAR_WIDTH = 300;
const MAX_SIDEBAR_WIDTH = 620;
const OVERLAY_TRIGGER_WIDTH = 420;
const NORMAL_GRID_SIDEBAR_WIDTH = 280;

const MainLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    query,
    setQuery,
    search,
    searchResults,
    isLoading,
    error,
  } = useSearch();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sidebarSize, setSidebarSize] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isNowPlayingCollapsed, setIsNowPlayingCollapsed] = useState(false);

  const isOverlaySidebar =
    !isSidebarCollapsed &&
    (isSidebarExpanded || sidebarSize > OVERLAY_TRIGGER_WIDTH);

  const sidebarGridWidth =
    isSidebarCollapsed
      ? `${MIN_SIDEBAR_WIDTH}px`
      : isOverlaySidebar
        ? `${NORMAL_GRID_SIDEBAR_WIDTH}px`
        : `${sidebarSize}px`;

  const sidebarActualWidth =
    isSidebarCollapsed
      ? `${MIN_SIDEBAR_WIDTH}px`
      : isOverlaySidebar
        ? `${Math.max(sidebarSize, 520)}px`
        : `${sidebarSize}px`;

  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    previous,
    next,
    seek,
    setVolume,
    setMuted,
    toggleShuffle,
    toggleRepeatMode,
    playTrack,
  } = usePlayer();

  const handleSelectSearchTrack = (track: Media) => {
    navigate(`/track/${track.id}`, {
      state: {
        track,
      },
    });
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    search(query);

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleStartResizeSidebar = () => {
    setIsResizingSidebar(true);

    const handleMouseMove = (event: MouseEvent) => {
      const nextWidth = Math.min(
        Math.max(event.clientX - 8, MIN_SIDEBAR_WIDTH),
        MAX_SIDEBAR_WIDTH,
      );

      setSidebarSize(nextWidth);

      if (nextWidth <= 120) {
        setIsSidebarCollapsed(true);
        setIsSidebarExpanded(false);
        return;
      }

      setIsSidebarCollapsed(false);
      setIsSidebarExpanded(false);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleToggleSidebarCollapse = () => {
    const nextCollapsed = !isSidebarCollapsed;

    setIsSidebarCollapsed(nextCollapsed);
    setIsSidebarExpanded(false);

    if (!nextCollapsed && sidebarSize < DEFAULT_SIDEBAR_WIDTH) {
      setSidebarSize(DEFAULT_SIDEBAR_WIDTH);
    }
  };

  const handleToggleSidebarExpand = () => {
    setIsSidebarCollapsed(false);

    setIsSidebarExpanded((prev) => {
      const nextExpanded = !prev;

      if (nextExpanded && sidebarSize < 520) {
        setSidebarSize(520);
      }

      if (!nextExpanded && sidebarSize > OVERLAY_TRIGGER_WIDTH) {
        setSidebarSize(DEFAULT_SIDEBAR_WIDTH);
      }

      return nextExpanded;
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#0a0a0a",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 
        ✅ Quan trọng:
        Chỉ mount listener khi đã có user.
        Nếu mount quá sớm lúc chưa có token/user thì SignalR không connect.
      */}
      {user && (
        <NotificationSignalRListener
          key={user.id ?? user.username}
        />
      )}

      <div style={{ flexShrink: 0 }}>
        <Header
          searchValue={query}
          searchResults={searchResults}
          searchLoading={isLoading}
          searchError={error}
          user={
            user
              ? {
                  displayName: user.username,
                  avatarUrl: user.avatarUrl,
                }
              : null
          }
          onSearchChange={setQuery}
          onSearch={handleSearch}
          onHomeClick={() => {
            window.dispatchEvent(new Event("tunevault:go-home"));
            navigate("/");
          }}
          onNotificationClick={() => navigate("/notifications")}
          onAvatarClick={() => navigate("/profile")}
          onPlayTrack={(track) => playTrack(track)}
          onSelectTrack={handleSelectSearchTrack}
        />
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: `${sidebarGridWidth} minmax(0, 1fr) ${
            isNowPlayingCollapsed ? "48px" : "320px"
          }`,
          gap: "8px",
          padding: "8px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            width: sidebarGridWidth,
            minWidth: sidebarGridWidth,
            height: "100%",
            minHeight: 0,
            overflow: "visible",
            zIndex: isOverlaySidebar ? 999 : 5,
          }}
        >
          <div
            style={{
              width: sidebarActualWidth,
              height: "100%",
              transition: isResizingSidebar ? "none" : "width 0.2s ease",
            }}
          >
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              isExpanded={isOverlaySidebar}
              onToggleCollapse={handleToggleSidebarCollapse}
              onToggleExpand={handleToggleSidebarExpand}
            />
          </div>

          <div
            onMouseDown={handleStartResizeSidebar}
            style={{
              position: "absolute",
              top: 0,
              right: isOverlaySidebar
                ? `calc(${sidebarActualWidth} - 4px)`
                : "-4px",
              width: "8px",
              height: "100%",
              cursor: "col-resize",
              zIndex: 1000,
              background: isResizingSidebar
                ? "rgba(255,255,255,0.18)"
                : "transparent",
            }}
          />
        </div>

        <div
          style={{
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            background: "#121212",
            borderRadius: "12px",
          }}
        >
          {children}
        </div>

        <div
          style={{
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <NowPlaying
            isCollapsed={isNowPlayingCollapsed}
            onToggleCollapse={() =>
              setIsNowPlayingCollapsed((prev) => !prev)
            }
          />
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <PlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          position={position}
          duration={duration}
          volume={volume}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          isMuted={isMuted}
          onTogglePlay={togglePlay}
          onPrev={previous}
          onNext={next}
          onSeek={seek}
          onVolumeChange={setVolume}
          onToggleShuffle={toggleShuffle}
          onToggleRepeatMode={toggleRepeatMode}
          onToggleMuted={() => setMuted(!isMuted)}
        />
      </div>
    </div>
  );
};

export default MainLayout;