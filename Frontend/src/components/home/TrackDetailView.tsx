<<<<<<< HEAD
import { useEffect, useState } from "react";
import { playlistApi } from "../../api/playlistApi";
import type { Playlist } from "../../types/playlist";

type Props = {
  mediaId: string | number;
};

const getPlaylistId = (playlist: Playlist) => {
  return playlist.id ?? playlist.playlistID ?? 0;
};

const getPlaylistName = (playlist: Playlist) => {
  return playlist.name ?? playlist.playlistName ?? "Playlist chưa có tên";
};

const AddToPlaylistButton = ({ mediaId }: Props) => {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadPlaylists = async () => {
      try {
        setLoading(true);
        const res = await playlistApi.getMyPlaylists();

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? [];

        setPlaylists(data);
      } catch (err) {
        console.error("LOAD PLAYLISTS ERROR:", err);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [open]);

  const handleAdd = async (playlistId: number) => {
    const id = Number(mediaId);
    if (!playlistId || !id) return;

    try {
      await playlistApi.addTrack(playlistId, id);
      setMessage("Đã thêm vào playlist");
      setTimeout(() => setMessage(""), 1800);
      setOpen(false);
    } catch (err) {
      console.error("ADD TO PLAYLIST ERROR:", err);
      setMessage("Không thêm được bài hát");
      setTimeout(() => setMessage(""), 1800);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        title="Thêm vào playlist"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid #b3b3b3",
          background: "transparent",
          color: "#b3b3b3",
          cursor: "pointer",
          fontSize: "20px",
          lineHeight: 1,
        }}
      >
        +
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "260px",
            background: "#282828",
            borderRadius: "8px",
            padding: "6px",
            zIndex: 999,
            boxShadow: "0 12px 32px rgba(0,0,0,.55)",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              padding: "10px 12px",
              borderBottom: "1px solid #3a3a3a",
              marginBottom: "4px",
            }}
          >
            Thêm vào danh sách phát
          </div>

          {loading && (
            <div style={{ color: "#b3b3b3", padding: "12px" }}>Đang tải...</div>
          )}

          {!loading && playlists.length === 0 && (
            <div style={{ color: "#b3b3b3", padding: "12px" }}>
              Bạn chưa có playlist
            </div>
          )}

          {!loading &&
            playlists.map((playlist) => {
              const playlistId = getPlaylistId(playlist);

              return (
                <button
                  key={playlistId}
                  onClick={() => handleAdd(playlistId)}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    color: "#fff",
                    padding: "12px",
                    textAlign: "left",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3a3a3a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {getPlaylistName(playlist)}
                </button>
              );
            })}
        </div>
      )}

      {message && (
        <div
          style={{
            position: "fixed",
            bottom: "110px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            color: "#000",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 700,
            zIndex: 9999,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddToPlaylistButton;
=======
import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useFavorite } from "../../hooks/useFavorite";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";
import TrackActionMenu from "../common/TrackActionMenu";


type TrackDetailViewProps = {
  track: Media;
  onOpenArtist: (artistName: string) => void;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
};

const TrackDetailView = ({ track, onOpenArtist }: TrackDetailViewProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { playTrack, setQueue } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorite();

  const artistName = track.artist?.name ?? "Unknown Artist";
  const liked = isFavorite(track.id);

  return (
    <>
      <section
        style={{
          display: "flex",
          gap: "28px",
          alignItems: "flex-end",
          padding: "24px 0 40px",
        }}
      >
        <div
          style={{
            width: "260px",
            height: "260px",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#282828",
            boxShadow: "0 20px 50px rgba(0,0,0,.5)",
            flexShrink: 0,
          }}
        >
          {track.thumbnailUrl ? (
            <img
              src={track.thumbnailUrl}
              alt={track.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#b3b3b3",
                fontSize: "76px",
              }}
            >
              ♪
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ color: "#fff", fontWeight: 700, marginBottom: "8px" }}>
            Bài hát
          </p>

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(48px,6vw,82px)",
              margin: 0,
              lineHeight: 1,
              wordBreak: "break-word",
            }}
          >
            {track.title}
          </h1>

          <div
            style={{
              marginTop: "14px",
              color: "#b3b3b3",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span
              onClick={() => onOpenArtist(artistName)}
              style={{
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {artistName}
            </span>

            <span>•</span>
            <span>{formatDuration(track.duration)}</span>
            <span>•</span>
            <span>{track.type}</span>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          marginBottom: "36px",
        }}
      >
        <button
          onClick={() => {
            setQueue([track]);
            playTrack(track);
          }}
          title="Phát"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "none",
            background: "#1DB954",
            color: "#000",
            fontSize: "24px",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          ▶
        </button>

        <button
          onClick={() => toggleFavorite(track.id)}
          title="Lưu vào bài hát đã thích"
          style={{
            border: "none",
            background: "transparent",
            fontSize: "34px",
            cursor: "pointer",
            color: liked ? "#1DB954" : "#b3b3b3",
          }}
        >
          {liked ? "♥" : "♡"}
        </button>

       <AddToPlaylistButton mediaId={track.id} />
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          title="Chia sẻ"
          style={{
            border: "none",
            background: "transparent",
            fontSize: "28px",
            cursor: "pointer",
            color: "#b3b3b3",
          }}
        >
          ↗
        </button>

        <div style={{ position: "relative" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            title="Tùy chọn khác"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "30px",
              cursor: "pointer",
              color: "#b3b3b3",
            }}
          >
            ⋯
          </button>

          <TrackActionMenu
            track={track}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onOpenArtist={onOpenArtist}
          />
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(280px,400px)",
          gap: "24px",
        }}
      >
        <div
          style={{
            background: "#181818",
            borderRadius: "14px",
            padding: "22px",
          }}
        >
          <h2 style={{ color: "#fff", marginBottom: "18px" }}>
            Thông tin bài hát
          </h2>

          <InfoRow label="Tên bài" value={track.title} />
          <InfoRow label="Nghệ sĩ" value={artistName} />
          <InfoRow label="Thời lượng" value={formatDuration(track.duration)} />
          <InfoRow label="Thể loại" value={track.genre ?? "Unknown"} />
          <InfoRow label="Loại" value={track.type} />
        </div>

        <div
          style={{
            background: "#181818",
            borderRadius: "14px",
            padding: "22px",
          }}
        >
          <h2 style={{ color: "#fff", marginBottom: "16px" }}>Về nghệ sĩ</h2>

          <p style={{ color: "#b3b3b3", lineHeight: 1.8 }}>
            {artistName} hiện đang có mặt trên TuneVault. Bạn có thể mở trang
            nghệ sĩ để xem thêm các bài hát liên quan.
          </p>
        </div>
      </section>
    </>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      padding: "12px 0",
      borderBottom: "1px solid #2a2a2a",
    }}
  >
    <span style={{ color: "#b3b3b3" }}>{label}</span>

    <span
      style={{
        color: "#fff",
        fontWeight: 700,
        textAlign: "right",
      }}
    >
      {value}
    </span>
  </div>
);

export default TrackDetailView;
>>>>>>> origin/vinh-branch
