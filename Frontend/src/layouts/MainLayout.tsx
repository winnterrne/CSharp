// src/layouts/MainLayout.tsx
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import LeftPanel from "../components/layout/LeftPanel";
import RightPanel from "../components/layout/RightPanel";
import PlayerBar from "../components/layout/PlayerBar";
import { usePlayer } from "../hooks/usePlayer";
import { useAuth } from "../hooks/useAuth";
import { useSearch } from "../hooks/useSearch";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const { results, loading, error } = useSearch(searchKeyword);
  const { user } = useAuth();

  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    shuffle,
    repeat,
    liked,
    togglePlay,
    prev,
    next,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#121212",
        overflow: "hidden",
        fontFamily:
          "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <Header
        searchValue={searchInput}
        searchResults={results}
        searchLoading={loading}
        searchError={error}
        user={
          user ?
            { displayName: user.username, avatarUrl: user.avatarUrl }
          : null
        }
        onSearchChange={setSearchInput}
        onSearch={() => setSearchKeyword(searchInput)}
        onHomeClick={() => navigate("/")}
        onNotificationClick={() => navigate("/notifications")}
        onAvatarClick={() => navigate("/profile")}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          gap: "10px",
            padding: "0px 12px 0px 10px",
        }}
      >
        <div
          style={{
            borderRadius: "12px 12px 0 0",
            paddingTop: 0,

            overflow: "hidden",
            background: "#121212",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <LeftPanel />
        </div>

        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            background: "#121212",
            minWidth: 0,
            height: "100%",
            display: "flex",
            flex: 1,
          }}
        >
          {children}
        </div>

        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            background: "#121212",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <RightPanel />
        </div>
      </div>

      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        shuffle={shuffle}
        repeat={repeat}
        liked={liked}
        onTogglePlay={togglePlay}
        onPrev={prev}
        onNext={next}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onToggleLike={toggleLike}
      />
    </div>
  );
};

export default MainLayout;
