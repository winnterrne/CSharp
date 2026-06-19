import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { playlistApi } from "../../api/playlistApi";
import { mediaApi } from "../../api/mediaApi";
import type { Playlist } from "../../types/playlist";
import type { Media } from "../../types/media";
import { ROUTES } from "../../constant/routes";

import CreatePlaylistModal from "../playlist/CreatePlaylistModal";
import { usePlayer } from "../../hooks/usePlayer";
import { useHistoryStore } from "../../store/historyStore";
import { useFavorite } from "../../hooks/useFavorite";
import { authStore } from "../../store/authStore";

import { albumApi } from "../../api/albumApi";
import type { Album } from "../../types/album";
import { useAlbumStore } from "../../store/albumStore";
import { useFollowStore } from "../../store/followStore";

type FilterTab = "playlist" | "favorite" | "following" | "album";

interface SidebarProps {
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggleCollapse: () => void;
  onToggleExpand: () => void;
}

const getPlaylistId = (playlist: Playlist) =>
  playlist.id ?? playlist.playlistID ?? 0;

const getPlaylistName = (playlist: Playlist) =>
  playlist.name ?? playlist.playlistName ?? "Playlist chưa có tên";

const getPlaylistTrackCount = (playlist: Playlist) =>
  playlist.trackCount ?? playlist.tracks?.length ?? 0;

const Sidebar = ({
  isCollapsed,
  isExpanded,
  onToggleCollapse,
  onToggleExpand,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = authStore((state) => state.token);
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  const canUseAuthApi = Boolean(token && isAuthenticated);

  const isWide = isExpanded;

  const [activeTab, setActiveTab] = useState<FilterTab>("playlist");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const recentTracks = useHistoryStore((state) => state.recentTracks);
  const { favoriteTracks, loadFavorites } = useFavorite();
  const { followedArtists, loadFollowedArtists } = useFollowStore();
  const { playTrack, setQueue } = usePlayer();

  const [albums, setAlbums] = useState<Album[]>([]);
  const setSelectedAlbumId = useAlbumStore((s) => s.setSelectedAlbumId);

  const fetchPlaylists = useCallback(async () => {
    if (!canUseAuthApi) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await playlistApi.getMyPlaylists();

      const rawData =
        Array.isArray(res.data) ? res.data
        : Array.isArray(res.data?.data) ? res.data.data
        : [];

      const mappedPlaylists: Playlist[] = rawData.map((item: any) => ({
        id: item.id ?? item.playlistID ?? item.playlistId ?? 0,
        playlistID: item.playlistID ?? item.playlistId ?? item.id ?? 0,
        name: item.name ?? item.playlistName ?? "Playlist chưa có tên",
        playlistName: item.playlistName ?? item.name ?? "Playlist chưa có tên",
        description: item.description ?? "",
        coverUrl: item.coverUrl ?? "",
        tracks: item.tracks ?? [],
        trackCount: item.trackCount ?? 0,
        isPublic: item.isPublic ?? true,
      }));

      setPlaylists(mappedPlaylists);
    } catch (error) {
      console.error("LOAD PLAYLISTS ERROR:", error);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, [canUseAuthApi]);

  useEffect(() => {
    // Avoid calling setState synchronously inside effect body by running
    // the async work in an immediately-invoked async function.
    (async () => {
      await fetchPlaylists();

      if (canUseAuthApi) {
        await loadFavorites();
        await loadFollowedArtists();
      }
    })();
  }, [fetchPlaylists, loadFavorites, loadFollowedArtists, canUseAuthApi]);

// ✅ Khi đổi route, reload lại playlist để Sidebar sync DB
useEffect(() => {
  if (!canUseAuthApi) return;

  fetchPlaylists();
}, [location.pathname, canUseAuthApi, fetchPlaylists]);

  useEffect(() => {
    albumApi.getAll().then((res) => {
      setAlbums(res.data?.data ?? []);
    });
  }, []);
 useEffect(() => {
  const reloadPlaylists = () => {
    fetchPlaylists();
  };

  const handleDeleted = (event: Event) => {
    const custom = event as CustomEvent<{ playlistId: number }>;
    const deletedId = Number(custom.detail?.playlistId);

    // ✅ Xóa khỏi Sidebar ngay lập tức
    setPlaylists((prev) =>
      prev.filter((playlist) => {
        const currentId =
          playlist.playlistID ??
          playlist.id ??
          0;

        return Number(currentId) !== deletedId;
      }),
    );

    // ✅ Reload lại sau một chút để sync DB
    setTimeout(() => {
      fetchPlaylists();
    }, 300);
  };

  window.addEventListener("tunevault:playlist-updated", reloadPlaylists);
  window.addEventListener("tunevault:playlist-deleted", handleDeleted);

  return () => {
    window.removeEventListener("tunevault:playlist-updated", reloadPlaylists);
    window.removeEventListener("tunevault:playlist-deleted", handleDeleted);
  };
}, [fetchPlaylists]);

  const handleOpenAlbum = (album: Album) => {
    setSelectedAlbumId(album.albumID);
    navigate(`/album/${album.albumID}`);
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    getPlaylistName(playlist).toLowerCase().includes(searchVal.toLowerCase()),
  );

  const filteredFavorites = favoriteTracks.filter((track) =>
    (track.title ?? "").toLowerCase().includes(searchVal.toLowerCase()),
  );

  const handleOpenPlaylist = (playlist: Playlist) => {
    const playlistId = getPlaylistId(playlist);

    if (!playlistId) return;

    navigate(ROUTES.PLAYLIST(playlistId));
  };

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
        <IconBtn title="Mở thư viện" onClick={onToggleCollapse}>
          <LibraryIcon />
        </IconBtn>

        <IconBtn title="Tạo playlist" onClick={handleCreatePlaylist}>
          <PlusIcon />
        </IconBtn>

        <IconBtn
          title={isExpanded ? "Thu về bình thường" : "Phóng to thư viện"}
          onClick={onToggleExpand}
        >
          {isExpanded ?
            <CollapseIcon />
          : <ExpandIcon />}
        </IconBtn>

        <div style={collapsedListStyle}>
          <SmallTile
            title="Bài hát yêu thích"
            active={activeTab === "favorite"}
            onClick={handleOpenFavoriteTab}
          >
            💚
          </SmallTile>

          {playlists.map((playlist) => {
            const playlistId = getPlaylistId(playlist);
            const playlistName = getPlaylistName(playlist);

            return (
              <SmallTile
                key={playlistId}
                title={playlistName}
                active={location.pathname === ROUTES.PLAYLIST(playlistId)}
                onClick={() => handleOpenPlaylist(playlist)}
              >
                {playlist.coverUrl ?
                  <img
                    src={playlist.coverUrl}
                    alt={playlistName}
                    style={imgFullStyle}
                  />
                : "🎵"}
              </SmallTile>
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
            <IconBtn title="Thu nhỏ thư viện" onClick={onToggleCollapse}>
              <LibraryIcon />
            </IconBtn>

            <span style={libraryTitleStyle}>Thư viện</span>
          </div>

          <div style={actionGroupStyle}>
            <IconBtn title="Tạo playlist" onClick={handleCreatePlaylist}>
              <PlusIcon />
            </IconBtn>
            <IconBtn
              title={isWide ? "Thu về bình thường" : "Phóng to thư viện"}
              onClick={onToggleExpand}
            >
              {isWide ?
                <CollapseIcon />
              : <ExpandIcon />}
            </IconBtn>
          </div>
        </div>

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

          <TabButton
            active={activeTab === "album"}
            onClick={() => setActiveTab("album")}
          >
            Album
          </TabButton>
        </div>
      </div>

      <div style={searchRowStyle}>
        <div
          style={{
            ...searchBoxStyle,
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
          }}
        >
          <button
            onClick={() => setSearchOpen((prev) => !prev)}
            title="Tìm kiếm"
            style={searchIconButtonStyle}
          >
            <SearchIcon />
          </button>

          {searchOpen && (
            <input
              autoFocus
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Tìm trong thư viện"
              style={searchInputStyle}
            />
          )}
        </div>

        <button
          onClick={() => setShowRecent((prev) => !prev)}
          title="Hiện bài hát gần đây"
          style={{
            ...recentButtonStyle,
            background: showRecent ? "#2a2a2a" : "transparent",
            color: showRecent ? "#fff" : "#b3b3b3",
          }}
        >
          Gần đây
          <SortIcon />
        </button>
      </div>

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
          followedArtists.length === 0 ?
            <EmptyText text="Chưa follow nghệ sĩ nào" />
          : followedArtists.map((artist) => (
              <ArtistRow
                key={artist.artistID}
                artist={artist}
                isWide={isWide}
              />
            ))

        : activeTab === "favorite" ?
          filteredFavorites.length === 0 ?
            <EmptyText text="Chưa có bài hát yêu thích" />
          : filteredFavorites.map((track) => (
              <TrackRow
                key={`favorite-${track.id}`}
                track={track}
                isWide={isWide}
                onClick={() => handlePlayTrackList(track, favoriteTracks)}
              />
            ))

        : activeTab === "album" ?
          albums.length === 0 ?
            <EmptyText text="Chưa có album" />
          : albums.map((album) => (
              <AlbumRow
                key={album.albumID}
                album={album}
                isWide={isWide}
                onClick={() => handleOpenAlbum(album)}
              />
            ))

        : loading ?
          <LoadingText />
        : filteredPlaylists.length === 0 ?
          <EmptyText text="Chưa có playlist" />
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
      <CoverBox size={isWide ? 64 : 48}>
        {playlist.coverUrl ?
          <img
            src={playlist.coverUrl}
            alt={playlistName}
            style={imgFullStyle}
          />
        : "🎵"}
      </CoverBox>

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
            marginTop: "4px",
          }}
        >
          Danh sách phát • {trackCount} bài
        </div>
      </div>
    </div>
  );
};

const AlbumRow = ({
  album,
  isWide,
  onClick,
}: {
  album: Album;
  isWide: boolean;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const selectedId = useAlbumStore((s) => s.selectedAlbumId);
  const active = selectedId === album.albumID;

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
      <CoverBox size={isWide ? 56 : 48}>
        {album.albumItemImage ?
          <img
            src={`http://localhost:5081/media/images/album/${album.albumItemImage}`}
            alt={album.albumName}
            style={imgFullStyle}
          />
        : "🎵"}
      </CoverBox>

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
          {album.albumName}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: isWide ? "13px" : "12px",
            marginTop: "4px",
          }}
        >
          Album • {album.artistName}
        </div>
      </div>
    </div>
  );
};

const TrackRow = ({
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
      <CoverBox size={isWide ? 56 : 48}>
        {track.thumbnailUrl ?
          <img
            src={track.thumbnailUrl}
            alt={track.title ?? "Media"}
            style={imgFullStyle}
          />
        : "💚"}
      </CoverBox>

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
          {track.title ?? "Không có tên"}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: isWide ? "13px" : "12px",
            marginTop: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Bài hát • {track.artist?.name ?? "Unknown Artist"}
        </div>
      </div>
    </div>
  );
};
///
type FollowedArtist = {
  artistID: number;
  artistName: string;
  artistImage?: string;
};

const ArtistRow = ({
  artist,
  isWide,
}: {
  artist: FollowedArtist;
  isWide: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
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
      <CoverBox size={isWide ? 56 : 48}>
        {artist.artistImage ?
          <img
            src={artist.artistImage}
            alt={artist.artistName}
            style={imgFullStyle}
          />
        : "🎤"}
      </CoverBox>

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
          {artist.artistName}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: isWide ? "13px" : "12px",
            marginTop: "4px",
          }}
        >
          Nghệ sĩ
        </div>
      </div>
    </div>
  );
};
///
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
    }}
  >
    {text}
  </div>
);

const LoadingText = () => (
  <div style={{ color: "#b3b3b3", fontSize: "13px", padding: "16px 10px" }}>
    Đang tải...
  </div>
);

const LibraryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18h18a1 1 0 1 1 0 2H3z" />
    <path d="M8 2h2v16H8z" />
    <path d="M14 2h2v16h-2z" />
    <path d="M20 2h2v16h-2z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);
const CollapseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* mũi tên trên phải chĩa vào giữa */}
    <path d="M18 6L12 12" />
    <path d="M14 6h4v4" />

    {/* mũi tên dưới trái chĩa vào giữa */}
    <path d="M6 18L12 12" />
    <path d="M10 18H6v-4" />
  </svg>
);
const ExpandIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* trên phải */}
    <path d="M12 12L18 6" />
    <path d="M14 6h4v4" />

    {/* dưới trái */}
    <path d="M12 12L6 18" />
    <path d="M10 18H6v-4" />
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

export default Sidebar;