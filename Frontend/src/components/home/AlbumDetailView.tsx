import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useFavorite } from "../../hooks/useFavorite";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";
import TrackActionMenu from "../common/TrackActionMenu";
import ShareMediaModal from "../share/ShareModal";
import { ShareIcon, AddToPlaylistIcon, PlayIcon, ShuffleIcon, DownloadIcon, MoreHorizIcon, HeartIcon } from "../common/icons";



type AlbumDetailViewProps = {
  cover?: Media;

  albumTitle?: string;
  albumImage?: string;
  artistName?: string;

  tracks: Media[];

  onOpenTrack: (track: Media) => void;
  onOpenArtist: (artistID: number, artistName: string, artistImage: string) => void;
};

const formatDuration = (seconds?: number) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
};

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
   albumTitle,
  albumImage,
  artistName,
  tracks,
  onOpenTrack,
  onOpenArtist,
}: AlbumDetailViewProps) => {
  const { playTrack, setQueue } = usePlayer();
  const [shuffle, setShuffle] = useState(false);

  const displayTitle =
    albumTitle ??
    cover?.albumName ??
    cover?.title ??
    "Album";

  const displayArtist =
    artistName ??
    cover?.artist?.name ??
    "Unknown Artist";
  
  const displayArtistID = cover?.artist?.id ?? tracks[0] ?. artist?.id;
  const displayArtistImage = cover?.artist?.avatarUrl ?? "";

  const displayImage =
    albumImage ??
    cover?.thumbnailUrl ??
    "";

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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b3b3b3",
            fontSize: "72px",
          }}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayTitle}
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
            {displayTitle}
          </h1>

          <p
            style={{
              color: "#d6d6d6",
              fontWeight: 600,
              marginTop: "12px",
            }}
          >
            <span
             onClick={() => {
                if (!displayArtistID) return;
                onOpenArtist(displayArtistID, displayArtist,displayArtistImage);
              }}
              style={{
                cursor: "pointer",
                color: "#fff",
              }}
            >
              {displayArtist}
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
          <PlayIcon/>
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
          <ShuffleIcon/>
        </button>

        {cover && (
          <AddToPlaylistButton mediaId={cover.id} />
        )}

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
          <DownloadIcon/>
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
          <MoreHorizIcon/>
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
  onOpenArtist: (artistID: number, artistName: string,artistImage: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { playTrack, setQueue } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorite();

  const liked = isFavorite(track.id);
  const artistID = track.artist?.id;
  const artistName = track.artist?.name ?? "Unknown Artist";
    const artistImage = track.artist?.avatarUrl ?? " ";

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
            <PlayIcon/>
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
            "♪"
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
              fontSize: "15px",
            }}
          >
            {track.title}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!artistID) return;
            onOpenArtist(artistID, artistName,artistImage);
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
          if (!artistID) return;
          onOpenArtist(artistID, artistName,artistImage);
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
              {/* {liked ? "♥" : "♡"} */}
              <HeartIcon/>
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
              <MoreHorizIcon/>
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
