import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/SideBar";
import PlayerBar from "../components/layout/PlayerBar";
import Header from "../components/layout/Header";
import NowPlaying from "../components/layout/NowPlaying";
import { usePlayer } from "../hooks/usePlayer";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../hooks/useSearch";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { query, setQuery, search, searchResults, isLoading, error } =
    useSearch();

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
          user
            ? { displayName: user.username, avatarUrl: user.avatarUrl }
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
          // FIX: cột NowPlaying lấy width theo component
gridTemplateColumns: "280px minmax(0, 1fr) auto",
          gap: "8px",
          padding: "8px 8px 0",
        }}
      >
        <Sidebar />

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

        <NowPlaying />
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