import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useFavorite } from "../../hooks/useFavorite";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";

type AlbumDetailViewProps = {
  cover: Media;
  tracks: Media[];
  onOpenTrack: (track: Media) => void;
  onOpenArtist: (artistName: string) => void;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${String(sec).padStart(2, "0")}`;
};

const AlbumDetailView = ({
  cover,
  tracks,
  onOpenTrack,
  onOpenArtist,
}: AlbumDetailViewProps) => {
  const { playTrack, setQueue } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorite();

  const [shuffle, setShuffle] = useState(false);

  const totalDuration = tracks.reduce(
    (sum, item) => sum + (item.duration ?? 0),
    0
  );

  const artistName = cover.artist?.name ?? "Unknown Artist";

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;

    const list = shuffle ? [...tracks].sort(() => Math.random() - 0.5) : tracks;

    setQueue(list);
    playTrack(list[0]);
  };

  return (
    <div>
      <section
        style={{
          display: "flex",
          gap: "26px",
          alignItems: "flex-end",
          padding: "22px 0 34px",
        }}
      >
        <div
          style={{
            width: "230px",
            height: "230px",
            borderRadius: "8px",
            background: "#282828",
            overflow: "hidden",
            boxShadow: "0 18px 50px rgba(0,0,0,.55)",
            flexShrink: 0,
          }}
        >
          {cover.thumbnailUrl ? (
            <img
              src={cover.thumbnailUrl}
              alt={cover.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
                color: "#b3b3b3",
              }}
            >
              ♪
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ color: "#fff", fontWeight: 700 }}>
            {tracks.length > 1 ? "Danh sách phát" : "Đĩa đơn"}
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

          <p style={{ color: "#d6d6d6", fontWeight: 600 }}>
            <span
              onClick={() => onOpenArtist(artistName)}
              style={{ cursor: "pointer", color: "#fff" }}
            >
              {artistName}
            </span>{" "}
            • {new Date().getFullYear()} • {tracks.length} bài hát •{" "}
            {formatDuration(totalDuration)}
          </p>
        </div>
      </section>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={handlePlayAlbum}
          title="Phát"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: "#1DB954",
            color: "#000",
            cursor: "pointer",
            fontSize: "24px",
            fontWeight: 900,
          }}
        >
          ▶
        </button>

        <button
          onClick={() => setShuffle(!shuffle)}
          title="Phát ngẫu nhiên"
          style={{
            background: "none",
            border: "none",
            color: shuffle ? "#1DB954" : "#b3b3b3",
            fontSize: "28px",
            cursor: "pointer",
          }}
        >
          ⇄
        </button>

        <AddToPlaylistButton mediaId={cover.id} />

        <button
          title="Tùy chọn khác"
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
      </section>

      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px minmax(0, 1.5fr) 48px minmax(140px,.7fr) 90px",
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
            liked={isFavorite(track.id)}
            onOpenTrack={onOpenTrack}
            onOpenArtist={onOpenArtist}
            onToggleFavorite={() => toggleFavorite(track.id)}
          />
        ))}
      </section>
    </div>
  );
};

const TrackRow = ({
  index,
  track,
  tracks,
  liked,
  onOpenTrack,
  onOpenArtist,
  onToggleFavorite,
}: {
  index: number;
  track: Media;
  tracks: Media[];
  liked: boolean;
  onOpenTrack: (track: Media) => void;
  onOpenArtist: (artistName: string) => void;
  onToggleFavorite: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const { playTrack, setQueue } = usePlayer();

  const artistName = track.artist?.name ?? "Unknown Artist";

  return (
    <div
      onClick={() => onOpenTrack(track)}
      onDoubleClick={() => {
        setQueue(tracks);
        playTrack(track);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns:
          "40px minmax(0, 1.5fr) 48px minmax(140px,.7fr) 90px",
        alignItems: "center",
        minHeight: "64px",
        padding: "0 8px",
        borderRadius: "8px",
        cursor: "pointer",
        gap: "12px",
        background: hovered ? "#1a1a1a" : "transparent",
      }}
    >
      <div style={{ color: "#b3b3b3" }}>
        {hovered ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQueue(tracks);
              playTrack(track);
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
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
          }}
        >
          {track.thumbnailUrl ? (
            <img
              src={track.thumbnailUrl}
              alt={track.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                color: "#b3b3b3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ♪
            </div>
          )}
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
        }}
      >
        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
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
        )}

        {formatDuration(track.duration)}
      </div>
    </div>
  );
};

export default AlbumDetailView;