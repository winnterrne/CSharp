import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useFavorite } from "../../hooks/useFavorite";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";
import TrackActionMenu from "../common/TrackActionMenu";
import ShareMediaModal from "../share/ShareModal";
import { PlayIcon, ShareIcon } from "../common/icons";


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
    const [shareOpen, setShareOpen] = useState(false);
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
          <PlayIcon/>
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
          onClick={() => setShareOpen(true)}
          title="Chia sẻ"
          style={{
            border: "none",
            background: "transparent",
            fontSize: "28px",
            cursor: "pointer",
            color: "#b3b3b3",
          }}
        >
          <ShareIcon/>
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
      <ShareMediaModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        mediaItemID={Number(track.id)}
        playlistID={null}
        title={`Chia sẻ ${track.type === "video" ? "video" : "bài hát"}`}
      />
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
