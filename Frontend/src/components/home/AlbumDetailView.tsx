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
  // NEW: trạng thái yêu thích playlist
  const [liked, setLiked] = useState(false);

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;

    setQueue(tracks);
    playTrack(tracks[0]);
  };

  return (
    <div>
      {/* NEW: HEADER ALBUM */}
      <section
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-end",
          marginBottom: "28px",
        }}
      >
        <img
          src={cover.thumbnailUrl}
          alt={cover.title}
          style={{
            width: "220px",
            height: "220px",
            borderRadius: "10px",
            objectFit: "cover",
            boxShadow: "0 18px 50px rgba(0,0,0,.55)",
          }}
        />

        <div>
          <p style={{ color: "#fff", fontWeight: 700 }}>Playlist</p>

          <h1
            style={{
              color: "#fff",
              fontSize: "56px",
              margin: "8px 0",
              lineHeight: 1,
            }}
          >
            {cover.title}
          </h1>

          <p style={{ color: "#b3b3b3" }}>
            <span
              onClick={() => onOpenArtist(cover.artist.name)}
              style={{
                color: "#1DB954",
                cursor: "pointer",
              }}
            >
              {cover.artist.name}
            </span>{" "}
            • {tracks.length} bài hát
          </p>
          <p
            style={{
              color: "#8a8a8a",
              marginTop: "10px",
              maxWidth: "700px",
              lineHeight: 1.6,
            }}
          >
            Playlist tuyển chọn từ {cover.artist.name}. Những bài hát được nghe
            nhiều nhất và phù hợp với sở thích của bạn.
          </p>
        </div>
      </section>

      {/* NEW: ACTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {/* NEW: Like */}
        <button
          onClick={() => setLiked(!liked)}
          style={{
            background: "none",
            border: "none",
            fontSize: "28px",
            cursor: "pointer",
            color: liked ? "#1DB954" : "#b3b3b3",
          }}
        >
          ♥
        </button>

        {/* NEW: Play */}
        <button
          onClick={handlePlayAlbum}
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            border: "none",
            background: "#1DB954",
            cursor: "pointer",
            fontSize: "22px",
            fontWeight: 800,
            boxShadow: "0 8px 20px rgba(0,0,0,.3)",
          }}
        >
          ▶
        </button>

        {/* NEW: More */}
        <button
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "26px",
            cursor: "pointer",
          }}
        >
          ⋯
        </button>
      </div>
      {/* NEW: TRACK LIST */}
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px minmax(0, 1fr) 180px 120px",
            color: "#b3b3b3",
            fontSize: "13px",
            borderBottom: "1px solid #333",
            padding: "0 8px 10px",
          }}
        >
          <div>#</div>
          <div>Tiêu đề</div>

          <div>Nghệ sĩ</div>

          <div style={{ textAlign: "right" }}>Thời lượng</div>
        </div>

        {tracks.map((track, index) => (
          <div
            key={track.id}
            // NEW: click mở TrackDetail
            onClick={() => onOpenTrack(track)}
            // NEW: double click phát nhạc
            onDoubleClick={() => {
              setQueue(tracks);
              playTrack(track);
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "40px minmax(0, 1fr) 180px 120px",
              alignItems: "center",
              height: "64px",
              padding: "0 8px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={{ color: "#b3b3b3" }}>{index + 1}</div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <img
                src={track.thumbnailUrl}
                alt={track.title}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />

              <div>
                <div style={{ color: "#fff", fontWeight: 700 }}>
                  {track.title}
                </div>

                <div style={{ color: "#b3b3b3", fontSize: "12px" }}>
                  {track.artist.name}
                </div>
              </div>
            </div>
            {/* FIX: cột nghệ sĩ */}
            <div
              onClick={() => onOpenArtist(track.artist.name)}
              style={{
                color: "#b3b3b3",
                cursor: "pointer",
                fontSize: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {track.artist.name}
            </div>
            <div style={{ color: "#b3b3b3", textAlign: "right" }}>
              {formatDuration(track.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumDetailView;
