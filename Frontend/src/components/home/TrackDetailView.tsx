import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import AddToPlaylistModal from "../playlist/AddToPlaylistModal";
import { useState } from "react";

type TrackDetailViewProps = {
  track: Media;

  // NEW
  onOpenArtist: (artistName: string) => void;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
};

const TrackDetailView = ({ track, onOpenArtist }: TrackDetailViewProps) => {
  const { playTrack, setQueue } = usePlayer();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <section
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-end",
          marginBottom: "32px",
        }}
      >
        <img
          src={track.thumbnailUrl}
          alt={track.title}
          style={{
            width: "240px",
            height: "240px",
            borderRadius: "12px",
            objectFit: "cover",
            boxShadow: "0 18px 50px rgba(0,0,0,.55)",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <p
            onClick={() => onOpenArtist(track.artist.name)}
            style={{
              color: "#1DB954",
              cursor: "pointer",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {track.artist.name}
          </p>

          <span style={{ color: "#b3b3b3" }}>
            • {formatDuration(track.duration)}
          </span>

          <span style={{ color: "#b3b3b3" }}>• {track.type}</span>
        </div>
      </section>

      {/* NEW: ACTION */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "28px" }}>
        <button
          onClick={() => {
            setQueue([track]);
            playTrack(track);
          }}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            background: "#1DB954",
            cursor: "pointer",
            fontSize: "22px",
            fontWeight: 800,
          }}
        >
          ▶
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            border: "none",
            borderRadius: "999px",
            background: "#2a2a2a",
            color: "#fff",
            padding: "0 18px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          + Thêm vào playlist
        </button>
      </div>

      {/* NEW: INFO CARD */}
      {/* NEW: ABOUT ARTIST */}
      <div
        style={{
          background: "#181818",
          borderRadius: "14px",
          padding: "20px",
          marginTop: "24px",
          maxWidth: "520px",
        }}
      >
        <h2
          style={{
            color: "#fff",
            marginBottom: "14px",
          }}
        >
          Về nghệ sĩ
        </h2>

        <p
          style={{
            color: "#b3b3b3",
            lineHeight: 1.8,
          }}
        >
          {track.artist.name} là một trong những nghệ sĩ nổi bật trên TuneVault.
          Các ca khúc của nghệ sĩ thường xuất hiện trong những playlist được
          nghe nhiều nhất.
        </p>
      </div>
      {/* NEW: ALBUM INFO */}
      <div
        style={{
          background: "#181818",
          borderRadius: "14px",
          padding: "20px",
          marginTop: "24px",
          maxWidth: "520px",
        }}
      >
        <h2
          style={{
            color: "#fff",
            marginBottom: "14px",
          }}
        >
          Album
        </h2>

        <p style={{ color: "#b3b3b3" }}>
          Bài hát này thuộc bộ sưu tập của {track.artist.name}.
        </p>
      </div>
      <div
        style={{
          background: "#181818",
          borderRadius: "14px",
          padding: "20px",
          maxWidth: "520px",
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: "14px" }}>
          Thông tin bài hát
        </h2>

        <p style={{ color: "#b3b3b3" }}>Tên bài: {track.title}</p>
        <p style={{ color: "#b3b3b3" }}>Nghệ sĩ: {track.artist.name}</p>
        <p style={{ color: "#b3b3b3" }}>
          Thời lượng: {formatDuration(track.duration)}
        </p>
        <p style={{ color: "#b3b3b3" }}>Thể loại: {track.genre ?? "Unknown"}</p>
      </div>

      <AddToPlaylistModal
        open={showAddModal}
        media={track}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
};

export default TrackDetailView;
