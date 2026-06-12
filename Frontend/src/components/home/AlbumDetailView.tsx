<<<<<<< HEAD
=======
import { useState } from "react";
>>>>>>> origin/vinh-branch
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useFavorite } from "../../hooks/useFavorite";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";
<<<<<<< HEAD

type TrackDetailViewProps = {
  track: Media;
=======
import TrackActionMenu from "../common/TrackActionMenu";

type AlbumDetailViewProps = {
  cover: Media;
  tracks: Media[];
  onOpenTrack: (track: Media) => void;
>>>>>>> origin/vinh-branch
  onOpenArtist: (artistName: string) => void;
};

const formatDuration = (seconds?: number) => {
<<<<<<< HEAD
  if (!seconds) return "0:00";
=======
  if (!seconds || Number.isNaN(seconds)) return "0:00";
>>>>>>> origin/vinh-branch

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
};

<<<<<<< HEAD
const TrackDetailView = ({ track, onOpenArtist }: TrackDetailViewProps) => {
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
=======
const formatTotalDuration = (tracks: Media[]) => {
  const totalSeconds = tracks.reduce(
    (sum, item) => sum + (item.duration ?? 0),
    0
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }

  return `${minutes} phút`;
};

const AlbumDetailView = ({
  cover,
  tracks,
  onOpenTrack,
  onOpenArtist,
}: AlbumDetailViewProps) => {
  const { playTrack, setQueue } = usePlayer();
  const [shuffle, setShuffle] = useState(false);

  const artistName = cover.artist?.name ?? "Unknown Artist";

  const handlePlayAll = () => {
    if (tracks.length === 0) return;

    const list = shuffle ? [...tracks].sort(() => Math.random() - 0.5) : tracks;

    setQueue(list);
    playTrack(list[0]);
  };

  return (
    <div>
      {/* HEADER */}
      <section
        style={{
          display: "flex",
          gap: "26px",
          alignItems: "flex-end",
          padding: "28px 0 34px",
>>>>>>> origin/vinh-branch
        }}
      >
        <div
          style={{
<<<<<<< HEAD
            width: "260px",
            height: "260px",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#282828",
            boxShadow: "0 20px 50px rgba(0,0,0,.5)",
            flexShrink: 0,
=======
            width: "230px",
            height: "230px",
            borderRadius: "8px",
            background: "#282828",
            overflow: "hidden",
            boxShadow: "0 18px 50px rgba(0,0,0,.55)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b3b3b3",
            fontSize: "72px",
          }}
        >
          {cover.thumbnailUrl ? (
            <img
              src={cover.thumbnailUrl}
              alt={cover.title}
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
          <p
            style={{
              color: "#fff",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            {tracks.length > 1 ? "Danh sách phát" : "Bài hát"}
          </p>

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(46px, 6vw, 82px)",
              margin: "8px 0",
              lineHeight: 1,
              wordBreak: "break-word",
            }}
          >
            {cover.title}
          </h1>

          <p
            style={{
              color: "#d6d6d6",
              fontWeight: 600,
              marginTop: "12px",
            }}
          >
            <span
              onClick={() => onOpenArtist(artistName)}
              style={{
                cursor: "pointer",
                color: "#fff",
              }}
            >
              {artistName}
            </span>{" "}
            • {tracks.length} bài hát • {formatTotalDuration(tracks)}
          </p>
        </div>
      </section>

      {/* ACTION BAR */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          title="Phát"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: tracks.length === 0 ? "#3a3a3a" : "#1DB954",
            color: "#000",
            cursor: tracks.length === 0 ? "not-allowed" : "pointer",
            fontSize: "24px",
            fontWeight: 900,
            boxShadow: "0 8px 24px rgba(0,0,0,.35)",
          }}
        >
          ▶
        </button>

        <button
          onClick={() => setShuffle((prev) => !prev)}
          title="Phát ngẫu nhiên"
          style={{
            background: "none",
            border: "none",
            color: shuffle ? "#1DB954" : "#b3b3b3",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          ⇄
        </button>

        <AddToPlaylistButton mediaId={cover.id} />

        <button
          title="Tải xuống"
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          ↓
        </button>

        <button
          title="Tùy chọn"
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          ⋯
        </button>

        <button
          title="Kiểu danh sách"
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Danh sách ☰
        </button>
      </section>

      {/* TRACK TABLE */}
      <section>
        {tracks.length === 0 ? (
          <EmptyTracks />
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "40px minmax(0, 1.7fr) 48px minmax(140px, .8fr) 120px",
                color: "#b3b3b3",
                fontSize: "13px",
                borderBottom: "1px solid #333",
                padding: "0 8px 10px",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div>#</div>
              <div>Tiêu đề</div>
              <div></div>
              <div>Nghệ sĩ</div>
              <div style={{ textAlign: "right" }}>⏱</div>
            </div>

            {tracks.map((track, index) => (
              <TrackRow
                key={track.id}
                index={index}
                track={track}
                tracks={tracks}
                onOpenTrack={onOpenTrack}
                onOpenArtist={onOpenArtist}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
};

const TrackRow = ({
  index,
  track,
  tracks,
  onOpenTrack,
  onOpenArtist,
}: {
  index: number;
  track: Media;
  tracks: Media[];
  onOpenTrack: (track: Media) => void;
  onOpenArtist: (artistName: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { playTrack, setQueue } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorite();

  const liked = isFavorite(track.id);
  const artistName = track.artist?.name ?? "Unknown Artist";

  const handlePlay = () => {
    setQueue(tracks);
    playTrack(track);
  };

  return (
    <div
      onClick={() => onOpenTrack(track)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMenuOpen(false);
      }}
      style={{
        display: "grid",
        gridTemplateColumns:
          "40px minmax(0, 1.7fr) 48px minmax(140px, .8fr) 120px",
        alignItems: "center",
        minHeight: "64px",
        padding: "0 8px",
        borderRadius: "8px",
        cursor: "pointer",
        gap: "12px",
        background: hovered ? "rgba(255,255,255,.18)" : "transparent",
        position: "relative",
      }}
    >
      <div style={{ color: "#b3b3b3" }}>
        {hovered ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            title="Phát"
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
>>>>>>> origin/vinh-branch
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
<<<<<<< HEAD
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
=======
            "♪"
>>>>>>> origin/vinh-branch
          )}
        </div>

        <div style={{ minWidth: 0 }}>
<<<<<<< HEAD
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

        <button
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
=======
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "15px",
            }}
          >
            {track.title}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenArtist(artistName);
            }}
            style={{
              color: "#b3b3b3",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            {artistName}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {hovered && <AddToPlaylistButton mediaId={track.id} />}
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          onOpenArtist(artistName);
        }}
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
        {hovered && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(track.id);
              }}
              title="Lưu vào bài hát đã thích"
              style={{
                border: "none",
                background: "transparent",
                color: liked ? "#1DB954" : "#b3b3b3",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              {liked ? "♥" : "♡"}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              title="Tùy chọn khác"
              style={{
                border: "none",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                fontSize: "22px",
              }}
            >
              ⋯
            </button>
          </>
        )}

        <span>{formatDuration(track.duration)}</span>

        <TrackActionMenu
          track={track}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onOpenArtist={onOpenArtist}
        />
      </div>
    </div>
  );
};

const EmptyTracks = () => (
  <div
    style={{
      textAlign: "center",
      padding: "80px 20px",
      color: "#b3b3b3",
    }}
  >
    <div style={{ fontSize: "72px", marginBottom: "20px" }}>♪</div>
    <h2 style={{ color: "#fff" }}>Chưa có bài hát</h2>
    <p>Danh sách này chưa có bài hát nào.</p>
  </div>
);

export default AlbumDetailView;
>>>>>>> origin/vinh-branch
