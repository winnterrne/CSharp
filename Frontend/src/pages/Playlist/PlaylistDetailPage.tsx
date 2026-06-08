import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { playlistApi } from "../../api/playlistApi";
import type { Playlist, PlaylistTrack, PlaylistDetailDto } from "../../types/playlist";
import { mapPlaylistDetailDtoToPlaylist } from "../../types/playlist";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";

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
  // NEW: tổng thời lượng playlist
  const totalDuration = useMemo(() => {
    const totalSeconds = mediaTracks.reduce(
      (sum, track) => sum + (track.duration ?? 0),
      0,
    );

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }

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
      {/* HEADER PLAYLIST */}
      <section
        style={{
          display: "flex",
          gap: "24px",
          padding: "32px",
          alignItems: "flex-end",
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
            fontSize: "64px",
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
          : "🎵"}
        </div>

        {/* INFO */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Playlist
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
                color: "#b3b3b3",
                marginBottom: "10px",
                maxWidth: "680px",
              }}
            >
              {playlist.description}
            </p>
          )}

          <div
            style={{
              color: "#b3b3b3",
              fontSize: "14px",
            }}
          >
            <strong style={{ color: "#fff" }}>
              {playlist.owner?.username ?? "Người dùng"}
            </strong>{" "}
            • {playlist.trackCount ?? playlistTracks.length} bài hát •{" "}
            {totalDuration}
          </div>
        </div>
      </section>

      {/* ACTION BAR */}
      <section
        style={{
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={handlePlayPlaylist}
          disabled={mediaTracks.length === 0}
          title="Phát playlist"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            background: mediaTracks.length === 0 ? "#3a3a3a" : "#1DB954",
            color: "#000",
            cursor: mediaTracks.length === 0 ? "not-allowed" : "pointer",
            fontSize: "22px",
            fontWeight: 800,
            boxShadow: "0 8px 24px rgba(0,0,0,.35)",
          }}
        >
          ▶
        </button>

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
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "40px minmax(0, 1.6fr) minmax(120px, 1fr) 90px",
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
              <div>Nghệ sĩ</div>
              <div style={{ textAlign: "right" }}>Thời lượng</div>
            </div>

            {/* TABLE BODY */}
            {playlistTracks.map((item, index) => (
              <PlaylistTrackRow
                key={item.id}
                item={item}
                index={index}
                onPlay={() => handlePlayTrack(item)}
              />
            ))}
          </div>
        }
      </section>
    </main>
  );
};

const PlaylistTrackRow = ({
  item,
  index,
  onPlay,
}: {
  item: PlaylistTrack;
  index: number;
  onPlay: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  const media = item.media;

  return (
    <div
      onDoubleClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "40px minmax(0, 1.6fr) minmax(120px, 1fr) 90px",
        gap: "12px",
        alignItems: "center",
        height: "64px",
        padding: "0 8px",
        borderRadius: "8px",
        background: hovered ? "#1a1a1a" : "transparent",
        cursor: "pointer",
      }}
    >
      <div style={{ color: "#b3b3b3", fontSize: "14px" }}>
        {hovered ?
          <span style={{ color: "#fff" }}>▶</span>
        : index + 1}{" "}
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
          : "🎵"}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {media.title}
          </div>

          <div
            style={{
              color: "#b3b3b3",
              fontSize: "12px",
              marginTop: "3px",
            }}
          >
            {media.type}
          </div>
        </div>
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
        {media.artist?.name ?? "Unknown Artist"}
      </div>

      <div
        style={{
          color: "#b3b3b3",
          fontSize: "14px",
          textAlign: "right",
        }}
      >
        {formatDuration(media.duration)}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
