import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { playlistApi } from "../../api/playlistApi";
import AddToPlaylistModal from "../../components/playlist/AddToPlaylistModal";
import type {
  Playlist,
  PlaylistTrack,
  PlaylistDetailDto,
} from "../../types/playlist";
import { mapPlaylistDetailDtoToPlaylist } from "../../types/playlist";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useSearch } from "../../hooks/useSearch";
import TrackActionMenu from "../../components/common/TrackActionMenu";
import ShareMediaModal from "../../components/share/ShareModal";
import {
  AddToPlaylistIcon,
  MoreHorizIcon,
  NowPlayingIcon,
  PlayIcon,
  ShareIcon,
  ShuffleIcon,
} from "../../components/common/icons";

const formatDuration = (seconds?: number) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${String(sec).padStart(2, "0")}`;
};

const getArtistName = (media: Media) => {
  const m = media as any; 
  return (
    m.artist?.name ??
    m.artist?.artistName ??
    m.artistName ??
    m.ArtistName ??
    "Không rõ nghệ sĩ"
  );
};

const getMediaId = (media: Media) => {
  const m = media as any;
  return m.id ?? m.mediaItemID ?? m.mediaItemId ?? 0;
};

const getPlaylistFromResponse = (responseData: unknown): Playlist => {
  const wrapper = responseData as { data?: PlaylistDetailDto };
  const raw = wrapper.data ?? (responseData as PlaylistDetailDto);
  return mapPlaylistDetailDtoToPlaylist(raw);
};

const PlaylistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { playTrack, pause, isPlaying, currentTrack, play, setQueue } =
    usePlayer();

  const {
    search,
    searchResults,
    isLoading: searching,
    error: searchError,
  } = useSearch();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddTrackBar, setShowAddTrackBar] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [addingTrack, setAddingTrack] = useState(false);
  const [addTrackMessage, setAddTrackMessage] = useState("");

  const [sharePlaylistOpen, setSharePlaylistOpen] = useState(false);

  // ✅ PLAYLIST MENU: menu 3 chấm playlist
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [updatingPlaylist, setUpdatingPlaylist] = useState(false);

  const playlistTracks = useMemo<PlaylistTrack[]>(() => {
    return playlist?.tracks ?? [];
  }, [playlist]);

  const mediaTracks = useMemo<Media[]>(() => {
    return playlistTracks.map((item) => item.media).filter(Boolean);
  }, [playlistTracks]);

  const isCurrentPlaylistPlaying = useMemo(() => {
  if (!currentTrack) return false;

  return mediaTracks.some(
      (track) => Number(getMediaId(track)) === Number(getMediaId(currentTrack)),
    );
  }, [currentTrack, mediaTracks]);

  const totalDuration = useMemo(() => {
    const totalSeconds = mediaTracks.reduce(
      (sum, track) => sum + (track.duration ?? 0),
      0,
    );

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) return `${hours} giờ ${mins} phút`;
    return `${mins} phút`;
  }, [mediaTracks]);

  const loadPlaylist = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const res = await playlistApi.getById(Number(id));
      const data = getPlaylistFromResponse(res.data);

      setPlaylist(data);
    } catch (err) {
      console.error("LOAD PLAYLIST ERROR:", err);
      setError("Không tải được playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  const handlePlayPlaylist = () => {
    if (mediaTracks.length === 0) return;

    if (!isCurrentPlaylistPlaying) {
      setQueue(mediaTracks);
      playTrack(mediaTracks[0]);
      return;
    }

    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // ✅ PLAYLIST PUBLIC/PRIVATE: đổi công khai / riêng tư
  const handleTogglePlaylistPublic = async () => {
    if (!playlist) return;

    try {
      setUpdatingPlaylist(true);

      const nextIsPublic = !playlist.isPublic;

      await playlistApi.update(playlist.id, {
        playlistID: playlist.id,
        playlistName: playlist.playlistName ?? playlist.name ?? "Playlist",
        description: playlist.description ?? "",
        isPublic: nextIsPublic,
      });

      // ✅ reload lại từ server cho chắc
      await loadPlaylist();

      setShowPlaylistMenu(false);
    } catch (error) {
      console.error("TOGGLE PLAYLIST PUBLIC ERROR:", error);
      alert("Không đổi được trạng thái playlist");
    } finally {
      setUpdatingPlaylist(false);
    }
  };

  // ✅ PLAYLIST DELETE
 const handleDeletePlaylist = async () => {
  if (!id) return;

  const playlistId = Number(id);

  const ok = window.confirm("Bạn chắc chắn muốn xóa playlist này?");
  if (!ok) return;

  try {
    await playlistApi.delete(playlistId);

    // ✅ báo Sidebar xóa ngay
    window.dispatchEvent(
      new CustomEvent("tunevault:playlist-deleted", {
        detail: { playlistId },
      }),
    );

    // ✅ báo các chỗ khác reload
    window.dispatchEvent(new Event("tunevault:playlist-updated"));

    navigate("/");
  } catch (error) {
    console.error("DELETE PLAYLIST ERROR:", error);
    alert("Không xóa được playlist");
    }
  };

  useEffect(() => {
    if (!showAddTrackBar) return;

    const keyword = searchKeyword.trim();

    if (!keyword) {
      setAddTrackMessage("");
      return;
    }

    const timer = setTimeout(() => {
      setAddTrackMessage("");
      search(keyword);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchKeyword, showAddTrackBar, search]);

  const handleAddTrackToCurrentPlaylist = async (mediaItemId: number) => {
    if (!id) return;

    const playlistId = Number(id);

    try {
      setAddingTrack(true);
      setAddTrackMessage("");

      await playlistApi.addTrack(playlistId, mediaItemId);

      setAddTrackMessage("Đã thêm bài hát vào playlist");

      const res = await playlistApi.getById(playlistId);
      const data = getPlaylistFromResponse(res.data);
      setPlaylist(data);
    } catch (err) {
      console.error("ADD TRACK ERROR:", err);
      setAddTrackMessage("Không thêm được bài hát");
    } finally {
      setAddingTrack(false);
    }
  };

  const handlePlayTrack = (track: Media) => {
    setQueue(mediaTracks);
    playTrack(track);
  };

  if (!id) {
    return <StatusPage text="Thiếu id playlist" danger />;
  }

  if (loading) {
    return <StatusPage text="Đang tải playlist..." />;
  }

  if (error || !playlist) {
    return <StatusPage text={error || "Không tìm thấy playlist"} danger />;
  }

  return (
    <main
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#121212",
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          display: "flex",
          gap: "24px",
          padding: "32px",
          alignItems: "flex-end",
          background:
            "linear-gradient(180deg, rgba(140, 70, 130, .95) 0%, #121212 100%)",
        }}
      >
        <div
          style={{
            width: "220px",
            height: "220px",
            background: "#282828",
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b3b3b3",
            fontSize: "72px",
            boxShadow: "0 16px 40px rgba(0,0,0,.45)",
          }}
        >
          {playlist.coverUrl ?
            <img
              src={playlist.coverUrl}
              alt={playlist.name || playlist.playlistName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          : "♪"}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            {playlist.isPublic ?
              "Danh sách phát công khai"
            : "Danh sách phát riêng tư"}
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(34px, 5vw, 72px)",
              lineHeight: 1,
              margin: "0 0 14px",
              wordBreak: "break-word",
            }}
          >
            {playlist.name || playlist.playlistName}
          </h1>

          {playlist.description && (
            <p
              style={{
                color: "#d7d7d7",
                marginBottom: "10px",
                maxWidth: "680px",
              }}
            >
              {playlist.description}
            </p>
          )}

          <div
            style={{
              color: "#d7d7d7",
              fontSize: "14px",
            }}
          >
            <strong style={{ color: "#fff" }}>TuneVault</strong> •{" "}
            {playlist.trackCount ?? playlistTracks.length} bài hát •{" "}
            {totalDuration}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <button
          onClick={handlePlayPlaylist}
          disabled={mediaTracks.length === 0}
          title="Phát playlist"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: mediaTracks.length === 0 ? "#3a3a3a" : "#1DB954",
            color: "#000",
            cursor: mediaTracks.length === 0 ? "not-allowed" : "pointer",
            fontSize: "22px",
            fontWeight: 900,
            boxShadow: "0 8px 24px rgba(0,0,0,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isCurrentPlaylistPlaying && isPlaying ?
            <NowPlayingIcon />
          : <PlayIcon />}
        </button>

        <button
          title="Phát ngẫu nhiên"
          style={{
            border: "none",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "30px",
          }}
        >
          <ShuffleIcon />
        </button>

        <button
          title="Thêm bài hát vào playlist"
          onClick={() => {
            setShowAddTrackBar((prev) => !prev);
            setAddTrackMessage("");
          }}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: `2px solid ${showAddTrackBar ? "#1DB954" : "#b3b3b3"}`,
            background: showAddTrackBar ? "#1DB954" : "transparent",
            color: showAddTrackBar ? "#000" : "#b3b3b3",
            cursor: "pointer",
            fontSize: "26px",
            fontWeight: 900,
          }}
        >
          <AddToPlaylistIcon />
        </button>

        <button
          title="Chia sẻ playlist"
          onClick={() => setSharePlaylistOpen(true)}
          style={{
            border: "none",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "28px",
          }}
        >
          <ShareIcon />
        </button>

        {/* ✅ PLAYLIST MENU: nút 3 chấm */}
        <div style={{ position: "relative" }}>
        <button
          title="Tùy chọn playlist"
            onClick={() => setShowPlaylistMenu((prev) => !prev)}
          style={{
            border: "none",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "30px",
          }}
        >
            <MoreHorizIcon />
        </button>

          {showPlaylistMenu && (
            <div
    style={{
                position: "absolute",
                top: "42px",
                left: 0,
                width: "230px",
                background: "#282828",
                borderRadius: "8px",
                padding: "6px",
                zIndex: 20,
                boxShadow: "0 12px 30px rgba(0,0,0,.55)",
    }}
  >
              <button
                disabled={updatingPlaylist}
                onClick={handleTogglePlaylistPublic}
                style={{
                  ...playlistMenuItemStyle,
                  opacity: updatingPlaylist ? 0.6 : 1,
                  cursor: updatingPlaylist ? "not-allowed" : "pointer",
                }}
              >
                {updatingPlaylist ?
                  "Đang cập nhật..."
                : playlist.isPublic ?
                  "Chuyển sang riêng tư"
                : "Chuyển sang công khai"}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowPlaylistMenu(false);
                }}
                style={playlistMenuItemStyle}
              >
                Sao chép link playlist
              </button>

              <button
                onClick={handleDeletePlaylist}
                style={{
                  ...playlistMenuItemStyle,
                  color: "#ff7676",
                }}
              >
                Xóa playlist
              </button>
            </div>
          )}
        </div>
      </section>

      {showAddTrackBar && (
        <section style={{ padding: "0 32px 24px" }}>
    <div
      style={{
        background: "#181818",
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "18px",
        }}
      >
        <input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Tìm bài hát để thêm vào playlist..."
          style={{
                width: "100%",
            height: "44px",
            borderRadius: "999px",
            border: "none",
            outline: "none",
            padding: "0 18px",
            background: "#242424",
            color: "#fff",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

      {searching && (
              <div style={{ marginTop: "10px", color: "#b3b3b3" }}>
          Đang tìm kiếm...
        </div>
      )}

      {(addTrackMessage || searchError) && (
        <div
          style={{
            marginTop: "10px",
            color:
                    addTrackMessage.includes("Đã") && !searchError ?
                      "#1DB954"
                : "#ff4d4f",
          }}
        >
          {searchError || addTrackMessage}
        </div>
      )}

      {searchKeyword.trim() && searchResults.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {searchResults.map((track) => (
            <div
              key={track.id}
              style={{
                display: "grid",
                gridTemplateColumns: "48px minmax(0, 1fr) auto",
                gap: "12px",
                alignItems: "center",
                padding: "10px",
                borderRadius: "8px",
                background: "#242424",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "6px",
                  background: "#333",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#b3b3b3",
                }}
              >
                      {track.thumbnailUrl ?
                  <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                      : "♪"}
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    color: "#fff",
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
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {getArtistName(track)}
                </div>
              </div>

              <button
                      onClick={() =>
                        handleAddTrackToCurrentPlaylist(Number(track.id))
                      }
                disabled={addingTrack}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  borderRadius: "999px",
                  border: "none",
                  background: addingTrack ? "#3a3a3a" : "#fff",
                  color: "#000",
                  cursor: addingTrack ? "not-allowed" : "pointer",
                  fontWeight: 800,
                }}
              >
                Thêm
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
)}

      <section style={{ padding: "0 32px 32px" }}>
        {playlistTracks.length === 0 ?
          <EmptyPlaylist />
        : <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "40px minmax(0, 1.6fr) 48px minmax(120px, 1fr) 110px",
                gap: "12px",
                color: "#b3b3b3",
                fontSize: "13px",
                borderBottom: "1px solid #333",
                padding: "0 8px 10px",
                alignItems: "center",
              }}
            >
              <div>#</div>
              <div>Tiêu đề</div>
              <div></div>
              <div>Nghệ sĩ</div>
              <div style={{ textAlign: "right" }}>Thời lượng</div>
            </div>

            {playlistTracks.map((item, index) => (
              <PlaylistTrackRow
                key={item.id}
                item={item}
                index={index}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                playlistQueue={mediaTracks}
                onPlay={() => handlePlayTrack(item.media)}
              />
            ))}
          </>
        }
      </section>

      <ShareMediaModal
        open={sharePlaylistOpen}
        onClose={() => setSharePlaylistOpen(false)}
        playlistID={Number(id)}
        mediaItemID={null}
        title="Chia sẻ playlist"
      />
    </main>
  );
};

const PlaylistTrackRow = ({
  item,
  index,
  currentTrack,
  isPlaying,
  playlistQueue,
  onPlay,
}: {
  item: PlaylistTrack;
  index: number;
  currentTrack: Media | null;
  isPlaying: boolean;
  playlistQueue: Media[];
  onPlay: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { playTrack, pause, play, setQueue } = usePlayer();

  const media = item.media;
  const artistName = getArtistName(media);

  const isThisTrackPlaying =
    currentTrack &&
    Number(getMediaId(currentTrack)) === Number(getMediaId(media));

  const showNowPlaying = Boolean(isThisTrackPlaying && isPlaying);

  const handlePlayThisTrack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setQueue(playlistQueue);

    if (isThisTrackPlaying) {
      if (isPlaying) pause();
      else play();
      return;
    }

    playTrack(media);
  };

  return (
    <div
      onDoubleClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns:
          "40px minmax(0, 1.6fr) 48px minmax(120px, 1fr) 110px",
        gap: "12px",
        alignItems: "center",
        height: "64px",
        padding: "0 8px",
        borderRadius: "8px",
        background:
          showNowPlaying ? "rgba(29,185,84,.18)"
          : hovered ? "#2a2a2a"
            : "transparent",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div
        style={{
          color: showNowPlaying ? "#1DB954" : "#b3b3b3",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hovered || isThisTrackPlaying ?
          <button
            onClick={handlePlayThisTrack}
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              background: "transparent",
              color: showNowPlaying ? "#1DB954" : "#fff",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showNowPlaying ?
              <NowPlayingIcon />
            : <PlayIcon />}
          </button>
        : index + 1}
      </div>

      <div
        onClick={onPlay}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "6px",
            background: "#282828",
            overflow: "hidden",
            flexShrink: 0,
            color: "#b3b3b3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {media.thumbnailUrl ?
            <img
              src={media.thumbnailUrl}
              alt={media.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          : "♪"}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: showNowPlaying ? "#1DB954" : "#fff",
              fontSize: "14px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {media.title}
          </div>

          <div
            style={{
              color: "#d0d0d0",
              fontSize: "12px",
              marginTop: "3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {artistName}
          </div>
        </div>
      </div>

      <div>
        {hovered && (
          <button
            title="Thêm vào playlist"
            onClick={(e) => {
              e.stopPropagation();
              setAddModalOpen(true);
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            +
          </button>
        )}

        <AddToPlaylistModal
          open={addModalOpen}
          media={media}
          onClose={() => setAddModalOpen(false)}
        />
      </div>

      <div
        style={{
          color: hovered || showNowPlaying ? "#fff" : "#b3b3b3",
          fontSize: "14px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {artistName}
      </div>

      <div
        style={{
          color: hovered || showNowPlaying ? "#fff" : "#b3b3b3",
          fontSize: "14px",
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
          position: "relative",
        }}
      >
        <span>{formatDuration(media.duration)}</span>

        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: "24px",
            }}
          >
            <MoreHorizIcon/>
          </button>
        )}

        <TrackActionMenu
          track={media}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </div>
  );
};

const StatusPage = ({ text, danger }: { text: string; danger?: boolean }) => (
  <div
    style={{
      height: "100%",
      background: "#121212",
      color: danger ? "#ff4d4f" : "#fff",
      padding: "24px",
      boxSizing: "border-box",
    }}
  >
    {text}
  </div>
);

const EmptyPlaylist = () => (
  <div
    style={{
      textAlign: "center",
      padding: "80px 20px",
      color: "#b3b3b3",
    }}
  >
    <div style={{ fontSize: "72px", marginBottom: "20px" }}>♪</div>
    <h2 style={{ color: "#fff" }}>Playlist trống</h2>
    <p>Hãy thêm bài hát vào playlist của bạn.</p>
  </div>
);

const playlistMenuItemStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "#fff",
  padding: "11px 12px",
  textAlign: "left",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 700,
};

export default PlaylistDetailPage;
