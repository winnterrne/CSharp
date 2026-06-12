import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { playlistApi } from "../../api/playlistApi";
<<<<<<< HEAD
import type { Playlist, PlaylistTrack, PlaylistDetailDto } from "../../types/playlist";
import { mapPlaylistDetailDtoToPlaylist } from "../../types/playlist";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
=======
import type {
  Playlist,
  PlaylistTrack,
  PlaylistDetailDto,
} from "../../types/playlist";
import { mapPlaylistDetailDtoToPlaylist } from "../../types/playlist";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useFavorite } from "../../hooks/useFavorite";
import TrackActionMenu from "../../components/common/TrackActionMenu";
>>>>>>> origin/vinh-branch

const formatDuration = (seconds?: number) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
};

const getPlaylistFromResponse = (responseData: unknown): Playlist => {
  const wrapper = responseData as {
    data?: PlaylistDetailDto;
  };

  const raw = wrapper.data ?? (responseData as PlaylistDetailDto);

  return mapPlaylistDetailDtoToPlaylist(raw);
};

const PlaylistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { playTrack, setQueue } = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const playlistTracks = useMemo<PlaylistTrack[]>(() => {
    return playlist?.tracks ?? [];
  }, [playlist]);

  const mediaTracks = useMemo<Media[]>(() => {
    return playlistTracks.map((item) => item.media).filter(Boolean);
  }, [playlistTracks]);
<<<<<<< HEAD
  // NEW: tổng thời lượng playlist
  const totalDuration = useMemo(() => {
    const totalSeconds = mediaTracks.reduce(
      (sum, track) => sum + (track.duration ?? 0),
      0,
=======

  const totalDuration = useMemo(() => {
    const totalSeconds = mediaTracks.reduce(
      (sum, track) => sum + (track.duration ?? 0),
      0
>>>>>>> origin/vinh-branch
    );

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

<<<<<<< HEAD
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }
=======
    if (hours > 0) return `${hours} giờ ${mins} phút`;
>>>>>>> origin/vinh-branch

    return `${mins} phút`;
  }, [mediaTracks]);

  useEffect(() => {
    if (!id) return;

    const loadPlaylist = async () => {
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

    loadPlaylist();
  }, [id]);

  const handlePlayPlaylist = () => {
    if (mediaTracks.length === 0) return;

    setQueue(mediaTracks);
    playTrack(mediaTracks[0]);
  };

<<<<<<< HEAD
  const handlePlayTrack = (playlistTrack: PlaylistTrack) => {
    if (!playlistTrack.media) return;

    setQueue(mediaTracks);
    playTrack(playlistTrack.media);
  };

  if (!id) {
    return (
      <div
        style={{
          height: "100%",
          background: "#121212",
          color: "#ff4d4f",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        Thiếu id playlist
      </div>
    );
  }
  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          background: "#121212",
          color: "#fff",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        Đang tải playlist...
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div
        style={{
          height: "100%",
          background: "#121212",
          color: "#ff4d4f",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        {error || "Không tìm thấy playlist"}
      </div>
    );
=======
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
>>>>>>> origin/vinh-branch
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
<<<<<<< HEAD
      {/* HEADER PLAYLIST */}
=======
>>>>>>> origin/vinh-branch
      <section
        style={{
          display: "flex",
          gap: "24px",
          padding: "32px",
          alignItems: "flex-end",
<<<<<<< HEAD
          background: "linear-gradient(180deg, #333 0%, #121212 100%)",
        }}
      >
        <button
          style={{
            border: "1px solid #555",
            background: "transparent",
            color: "#fff",
            borderRadius: "999px",
            padding: "10px 18px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Thêm bài hát
        </button>
        {/* COVER */}
=======
          background:
            "linear-gradient(180deg, rgba(140, 70, 130, .95) 0%, #121212 100%)",
        }}
      >
>>>>>>> origin/vinh-branch
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
<<<<<<< HEAD
            fontSize: "64px",
            boxShadow: "0 16px 40px rgba(0,0,0,.45)",
          }}
        >
          {playlist.coverUrl ?
=======
            color: "#b3b3b3",
            fontSize: "72px",
            boxShadow: "0 16px 40px rgba(0,0,0,.45)",
          }}
        >
          {playlist.coverUrl ? (
>>>>>>> origin/vinh-branch
            <img
              src={playlist.coverUrl}
              alt={playlist.name || playlist.playlistName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
<<<<<<< HEAD
          : "🎵"}
        </div>

        {/* INFO */}
=======
          ) : (
            "♪"
          )}
        </div>

>>>>>>> origin/vinh-branch
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
<<<<<<< HEAD
            Playlist
=======
            Danh sách phát công khai
>>>>>>> origin/vinh-branch
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
<<<<<<< HEAD
                color: "#b3b3b3",
=======
                color: "#d7d7d7",
>>>>>>> origin/vinh-branch
                marginBottom: "10px",
                maxWidth: "680px",
              }}
            >
              {playlist.description}
            </p>
          )}

          <div
            style={{
<<<<<<< HEAD
              color: "#b3b3b3",
              fontSize: "14px",
            }}
          >
            <strong style={{ color: "#fff" }}>
              {playlist.owner?.username ?? "Người dùng"}
            </strong>{" "}
            • {playlist.trackCount ?? playlistTracks.length} bài hát •{" "}
=======
              color: "#d7d7d7",
              fontSize: "14px",
            }}
          >
            <strong style={{ color: "#fff" }}>TuneVault</strong> •{" "}
            {playlist.trackCount ?? playlistTracks.length} bài hát •{" "}
>>>>>>> origin/vinh-branch
            {totalDuration}
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* ACTION BAR */}
=======
>>>>>>> origin/vinh-branch
      <section
        style={{
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
<<<<<<< HEAD
          gap: "16px",
=======
          gap: "18px",
>>>>>>> origin/vinh-branch
        }}
      >
        <button
          onClick={handlePlayPlaylist}
          disabled={mediaTracks.length === 0}
          title="Phát playlist"
          style={{
<<<<<<< HEAD
            width: "56px",
            height: "56px",
=======
            width: "60px",
            height: "60px",
>>>>>>> origin/vinh-branch
            borderRadius: "50%",
            border: "none",
            background: mediaTracks.length === 0 ? "#3a3a3a" : "#1DB954",
            color: "#000",
            cursor: mediaTracks.length === 0 ? "not-allowed" : "pointer",
            fontSize: "22px",
<<<<<<< HEAD
            fontWeight: 800,
=======
            fontWeight: 900,
>>>>>>> origin/vinh-branch
            boxShadow: "0 8px 24px rgba(0,0,0,.35)",
          }}
        >
          ▶
        </button>

<<<<<<< HEAD
        <span
          style={{
            color: "#b3b3b3",
            fontSize: "14px",
          }}
        >
          Double click vào bài hát để phát
        </span>
      </section>

      {/* TRACK LIST */}
      <section style={{ padding: "0 32px 32px" }}>
        {playlistTracks.length === 0 ?
          <div
            style={{
              color: "#b3b3b3",
              padding: "24px 0",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
              }}
            >
              <div
                style={{
                  fontSize: "72px",
                  marginBottom: "20px",
                }}
              >
                🎵
              </div>

              <h2 style={{ color: "#fff" }}>Playlist trống</h2>

              <p style={{ color: "#b3b3b3" }}>
                Hãy thêm bài hát vào playlist của bạn.
              </p>
            </div>{" "}
          </div>
        : <div>
            {/* TABLE HEADER */}
=======
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
          ⇄
        </button>

        <button
          title="Thêm vào thư viện"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "2px solid #b3b3b3",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          +
        </button>

        <button
          title="Tải xuống"
          style={{
            border: "none",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "30px",
          }}
        >
          ↓
        </button>

        <button
          title="Tùy chọn playlist"
          style={{
            border: "none",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "30px",
          }}
        >
          ⋯
        </button>
      </section>

      <section style={{ padding: "0 32px 32px" }}>
        {playlistTracks.length === 0 ? (
          <EmptyPlaylist />
        ) : (
          <>
>>>>>>> origin/vinh-branch
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
<<<<<<< HEAD
                  "40px minmax(0, 1.6fr) minmax(120px, 1fr) 90px",
=======
                  "40px minmax(0, 1.6fr) 48px minmax(120px, 1fr) 110px",
>>>>>>> origin/vinh-branch
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
<<<<<<< HEAD
=======
              <div></div>
>>>>>>> origin/vinh-branch
              <div>Nghệ sĩ</div>
              <div style={{ textAlign: "right" }}>Thời lượng</div>
            </div>

<<<<<<< HEAD
            {/* TABLE BODY */}
=======
>>>>>>> origin/vinh-branch
            {playlistTracks.map((item, index) => (
              <PlaylistTrackRow
                key={item.id}
                item={item}
                index={index}
<<<<<<< HEAD
                onPlay={() => handlePlayTrack(item)}
              />
            ))}
          </div>
        }
=======
                tracks={mediaTracks}
                onPlay={() => handlePlayTrack(item.media)}
              />
            ))}
          </>
        )}
>>>>>>> origin/vinh-branch
      </section>
    </main>
  );
};

const PlaylistTrackRow = ({
  item,
  index,
<<<<<<< HEAD
=======
  tracks,
>>>>>>> origin/vinh-branch
  onPlay,
}: {
  item: PlaylistTrack;
  index: number;
<<<<<<< HEAD
  onPlay: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  const media = item.media;
=======
  tracks: Media[];
  onPlay: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { playTrack, setQueue } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorite();

  const media = item.media;
  const liked = isFavorite(media.id);
  const artistName = media.artist?.name ?? "Unknown Artist";
>>>>>>> origin/vinh-branch

  return (
    <div
      onDoubleClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
<<<<<<< HEAD
        gridTemplateColumns: "40px minmax(0, 1.6fr) minmax(120px, 1fr) 90px",
=======
        gridTemplateColumns:
          "40px minmax(0, 1.6fr) 48px minmax(120px, 1fr) 110px",
>>>>>>> origin/vinh-branch
        gap: "12px",
        alignItems: "center",
        height: "64px",
        padding: "0 8px",
        borderRadius: "8px",
<<<<<<< HEAD
        background: hovered ? "#1a1a1a" : "transparent",
        cursor: "pointer",
      }}
    >
      <div style={{ color: "#b3b3b3", fontSize: "14px" }}>
        {hovered ?
          <span style={{ color: "#fff" }}>▶</span>
        : index + 1}{" "}
=======
        background: hovered ? "#555" : "transparent",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div style={{ color: "#b3b3b3", fontSize: "14px" }}>
        {hovered ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQueue(tracks);
              playTrack(media);
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ▶
          </button>
        ) : (
          index + 1
        )}
>>>>>>> origin/vinh-branch
      </div>

      <div
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
<<<<<<< HEAD
=======
            color: "#b3b3b3",
>>>>>>> origin/vinh-branch
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
<<<<<<< HEAD
          {media.thumbnailUrl ?
=======
          {media.thumbnailUrl ? (
>>>>>>> origin/vinh-branch
            <img
              src={media.thumbnailUrl}
              alt={media.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
<<<<<<< HEAD
          : "🎵"}
=======
          ) : (
            "♪"
          )}
>>>>>>> origin/vinh-branch
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
              fontSize: "14px",
<<<<<<< HEAD
              fontWeight: 600,
=======
              fontWeight: 700,
>>>>>>> origin/vinh-branch
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {media.title}
          </div>

          <div
            style={{
<<<<<<< HEAD
              color: "#b3b3b3",
=======
              color: "#d0d0d0",
>>>>>>> origin/vinh-branch
              fontSize: "12px",
              marginTop: "3px",
            }}
          >
<<<<<<< HEAD
            {media.type}
=======
            {artistName}
>>>>>>> origin/vinh-branch
          </div>
        </div>
      </div>

<<<<<<< HEAD
=======
      <div>
        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(media.id);
            }}
            style={{
              border: "none",
              background: "transparent",
              color: liked ? "#1DB954" : "#fff",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            {liked ? "♥" : "+"}
          </button>
        )}
      </div>

>>>>>>> origin/vinh-branch
      <div
        style={{
          color: "#b3b3b3",
          fontSize: "14px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
<<<<<<< HEAD
        {media.artist?.name ?? "Unknown Artist"}
=======
        {artistName}
>>>>>>> origin/vinh-branch
      </div>

      <div
        style={{
          color: "#b3b3b3",
          fontSize: "14px",
          textAlign: "right",
<<<<<<< HEAD
        }}
      >
        {formatDuration(media.duration)}
=======
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
            ⋯
          </button>
        )}

        <TrackActionMenu
          track={media}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
>>>>>>> origin/vinh-branch
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default PlaylistDetailPage;
=======
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

export default PlaylistDetailPage;
>>>>>>> origin/vinh-branch
