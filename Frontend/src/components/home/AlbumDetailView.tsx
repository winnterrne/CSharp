import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";

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
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const totalDuration = tracks.reduce(
    (sum, item) => sum + (item.duration ?? 0),
    0,
  );
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
          {cover.thumbnailUrl ?
            <img
              src={cover.thumbnailUrl}
              alt={cover.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          : <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
              }}
            >
              🎵
            </div>
          }
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
              onClick={() =>
                onOpenArtist(cover.artist?.name ?? "Unknown Artist")
              }
              style={{ cursor: "pointer", color: "#fff" }}
            >
              {cover.artist?.name ?? "Unknown Artist"}
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
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          🔀
        </button>

        <button
          onClick={() => setLiked(!liked)}
          title="Yêu thích"
          style={{
            background: "none",
            border: "none",
            color: liked ? "#1DB954" : "#b3b3b3",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          {liked ? "♥" : "♡"}
        </button>

        <button
          title="Tải xuống"
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "28px",
            cursor: "pointer",
          }}
        >
          ⬇
        </button>

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

        <button
          onClick={() => setCompactView(!compactView)}
          title="Đổi kiểu danh sách"
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Danh sách ☰
        </button>
      </section>

      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              compactView ?
                "40px minmax(0, 1fr) 90px"
              : "40px minmax(0, 1.4fr) minmax(140px, .8fr) 90px",
            color: "#b3b3b3",
            fontSize: "13px",
            borderBottom: "1px solid #333",
            padding: "0 8px 10px",
            alignItems: "center",
          }}
        >
          <div>#</div>
          <div>Tiêu đề</div>
          {!compactView && <div>Nghệ sĩ</div>}
          <div style={{ textAlign: "right" }}>⏱</div>
        </div>

        {tracks.map((track, index) => (
          <div
            key={track.id}
            onClick={() => onOpenTrack(track)}
            onDoubleClick={() => {
              setQueue(tracks);
              playTrack(track);
            }}
            style={{
              display: "grid",
              gridTemplateColumns:
                compactView ?
                  "40px minmax(0, 1fr) 90px"
                : "40px minmax(0, 1.4fr) minmax(140px, .8fr) 90px",
              alignItems: "center",
              minHeight: "64px",
              padding: "0 8px",
              borderRadius: "8px",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={{ color: "#b3b3b3" }}>{index + 1}</div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: 0,
              }}
            >
              {!compactView && (
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
                  {track.thumbnailUrl ?
                    <img
                      src={track.thumbnailUrl}
                      alt={track.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  : <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      🎵
                    </div>
                  }
                </div>
              )}

              <div style={{ minWidth: 0 }}>
                <button
                  onClick={() => onOpenTrack(track)}
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "15px",
                    maxWidth: "100%",
                    textAlign: "left",
                  }}
                >
                  {track.title}
                </button>

                <div
                  onClick={() =>
                    onOpenArtist(track.artist?.name ?? "Unknown Artist")
                  }
                  style={{
                    color: "#b3b3b3",
                    fontSize: "13px",
                    marginTop: "4px",
                    cursor: "pointer",
                  }}
                >
                  {track.artist?.name ?? "Unknown Artist"}
                </div>
              </div>
            </div>

            {!compactView && (
              <div
                onClick={() => onOpenArtist(track.artist.name)}
                style={{
                  color: "#b3b3b3",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
              >
                {track.artist.name}
              </div>
            )}

            <div
              style={{
                color: "#b3b3b3",
                fontSize: "14px",
                textAlign: "right",
              }}
            >
              {formatDuration(track.duration)}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AlbumDetailView;
