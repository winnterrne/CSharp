import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/SideBar";
import PlayerBar from "../components/layout/PlayerBar";
import Header from "../components/layout/Header";
import NowPlaying from "../components/layout/NowPlaying";
import { usePlayer } from "../hooks/usePlayer";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../hooks/useSearch";
import { useState, type ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { query, setQuery, search, searchResults, isLoading, error } =
    useSearch();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const sidebarWidth = isSidebarCollapsed ? "80px" : "280px";
  const [isNowPlayingCollapsed, setIsNowPlayingCollapsed] = useState(false);

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

  const handleSearch = () => {
    if (query.trim()) {
      search(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#0a0a0a",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        searchValue={query}
        searchResults={searchResults}
        searchLoading={isLoading}
        searchError={error}
        user={
          user ?
            { displayName: user.username, avatarUrl: user.avatarUrl }
          : null
        }
        onSearchChange={setQuery}
        onSearch={handleSearch}
        onHomeClick={() => navigate("/")}
        onNotificationClick={() => navigate("/notifications")}
        onAvatarClick={() => navigate("/profile")}
        onPlayTrack={(track) => playTrack(track)}
        onSelectTrack={(track) => playTrack(track)}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: `${sidebarWidth} minmax(0,1fr) ${
            isNowPlayingCollapsed ? "48px" : "320px"
          }`,
          gap: "8px",
          padding: "8px 8px 0",
        }}
      >
        {/* SIDEBAR COLUMN */}
        <div
          style={{
            position: "relative",
            width: sidebarWidth,
            minWidth: sidebarWidth,
            height: "100%",
          }}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            isExpanded={isSidebarExpanded}
            onToggleCollapse={() => {
              setIsSidebarCollapsed((prev) => !prev);
              setIsSidebarExpanded(false);
            }}
            onToggleExpand={() => {
              setIsSidebarCollapsed(false);
              setIsSidebarExpanded((prev) => !prev);
            }}
          />
        </div>
        <div
          style={{
            minWidth: 0,
            overflow: "hidden",
            background: "#121212",
            borderRadius: "12px",
          }}
        >
          {children}
        </div>

        <NowPlaying
          isCollapsed={isNowPlayingCollapsed}
          onToggleCollapse={() => setIsNowPlayingCollapsed((prev) => !prev)}
        />
      </div>

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
  );
};

export default MainLayout;
