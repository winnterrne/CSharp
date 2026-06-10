import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";

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

const TrackDetailView = ({
  track,
  onOpenArtist,
}: TrackDetailViewProps) => {
  const { playTrack, setQueue } = usePlayer();

  const [liked, setLiked] = useState(false);

  const artistName =
    track.artist?.name ?? "Unknown Artist";

  return (
    <>
      {/* HEADER */}
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
            borderRadius: "12px",
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
                fontSize: "70px",
              }}
            >
              🎵
            </div>
          )}
        </div>

        <div>
          <p
            style={{
              color: "#fff",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Bài hát
          </p>

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(48px,6vw,82px)",
              margin: 0,
              lineHeight: 1,
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

            <span>
              {formatDuration(track.duration)}
            </span>

            <span>•</span>

            <span>{track.type}</span>
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        <button
          onClick={() => {
            setQueue([track]);
            playTrack(track);
          }}
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
          onClick={() => setLiked(!liked)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "30px",
            cursor: "pointer",
            color: liked ? "#1DB954" : "#b3b3b3",
          }}
        >
          {liked ? "♥" : "♡"}
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              window.location.href
            );
          }}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "24px",
            cursor: "pointer",
            color: "#b3b3b3",
          }}
        >
          📤
        </button>

        <button
          style={{
            border: "none",
            background: "transparent",
            fontSize: "28px",
            cursor: "pointer",
            color: "#b3b3b3",
          }}
        >
          ⋯
        </button>
      </section>

      {/* CONTENT */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0,1fr) minmax(280px,400px)",
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
          <h2
            style={{
              color: "#fff",
              marginBottom: "18px",
            }}
          >
            Thông tin bài hát
          </h2>

          <InfoRow
            label="Tên bài"
            value={track.title}
          />

          <InfoRow
            label="Nghệ sĩ"
            value={artistName}
          />

          <InfoRow
            label="Thời lượng"
            value={formatDuration(track.duration)}
          />

          <InfoRow
            label="Thể loại"
            value={track.genre ?? "Unknown"}
          />

          <InfoRow
            label="Loại"
            value={track.type}
          />
        </div>

        <div
          style={{
            background: "#181818",
            borderRadius: "14px",
            padding: "22px",
          }}
        >
          <h2
            style={{
              color: "#fff",
              marginBottom: "16px",
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
            {artistName} hiện đang có mặt trên
            TuneVault. Bạn có thể mở trang nghệ sĩ
            để xem thêm các bài hát liên quan.
          </p>
        </div>
      </section>
    </>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      padding: "12px 0",
      borderBottom: "1px solid #2a2a2a",
    }}
  >
    <span style={{ color: "#b3b3b3" }}>
      {label}
    </span>

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