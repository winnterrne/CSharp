import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { playlistApi } from "../../api/playlistApi";
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

  const totalDuration = useMemo(() => {
    const totalSeconds = mediaTracks.reduce(
      (sum, track) => sum + (track.duration ?? 0),
      0
    );

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) return `${hours} giờ ${mins} phút`;

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
          {playlist.coverUrl ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.name || playlist.playlistName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            "♪"
          )}
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
            Danh sách phát công khai
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
          }}
        >
          ▶
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
                tracks={mediaTracks}
                onPlay={() => handlePlayTrack(item.media)}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
};

const PlaylistTrackRow = ({
  item,
  index,
  tracks,
  onPlay,
}: {
  item: PlaylistTrack;
  index: number;
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
            color: "#b3b3b3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {media.thumbnailUrl ? (
            <img
              src={media.thumbnailUrl}
              alt={media.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            "♪"
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
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
            }}
          >
            {artistName}
          </div>
        </div>
      </div>

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

      <div
        style={{
          color: "#b3b3b3",
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
          color: "#b3b3b3",
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
            ⋯
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

export default PlaylistDetailPage;