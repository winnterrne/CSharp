import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useFavorite } from "../../hooks/useFavorite";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";
import ShareMediaModal from "../share/ShareModal";
import { HeartIcon, NowPlayingIcon, PlayIcon, ShareIcon } from "../common/icons";
import { aiApi } from "../../api/aiApi";

  type TrackDetailViewProps = {
    track: Media;
    onOpenArtist: (artistID: number, artistName: string, artistImage: string) => void; 
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return `${min}:${String(sec).padStart(2, "0")}`;
  };

  const TrackDetailView = ({ track, onOpenArtist }: TrackDetailViewProps) => {
    const [shareOpen, setShareOpen] = useState(false);

    const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [aiDescription, setAiDescription] = useState<string | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const { playTrack, isPlaying, currentTrack, setQueue, play, pause } = usePlayer();
    const { isFavorite, toggleFavorite } = useFavorite();

    const artistID = track.artist?.id;
    const artistName = track.artist?.name ?? "Unknown Artist";
    const artistImage = track.artist?.avatarUrl ?? "";  

console.log("track full:", JSON.stringify(track, null, 2));
    console.log(track);
    console.log(track.artist);
    console.log(track.artist?.id);
    const liked = isFavorite(track.id);
    const getMediaId = (media: Media) => {
    const m = media as any;

    return m.id ?? m.mediaItemID ?? m.mediaItemId ?? 0;
  };
    const isThisTrackPlaying =
    currentTrack &&
    Number(getMediaId(currentTrack)) === Number(getMediaId(track));

  const showNowPlaying = Boolean(isThisTrackPlaying && isPlaying);

   const fetchAiDescription = async () => {
    const mediaId = getMediaId(track);
    setAiStatus("loading");
    setAiDescription(null);
    setAiError(null);
    try {
      const res = await aiApi.getDescription(mediaId);
      // Điều chỉnh nếu backend trả về shape khác
      const desc = res.data?.description ?? res.data?.data?.description ?? "";
      setAiDescription(desc);
      setAiStatus("success");
    } catch (err: any) {
      setAiError(err?.response?.data?.message ?? "Không thể tải mô tả AI.");
      setAiStatus("error");
    }
  };

  return (
    <>
      <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `}</style>
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
              onClick={() => {
                console.log("OPEN ARTIST", {
                  artistID,
                  artistName,
                  artistImage,
                });

                onOpenArtist(artistID, artistName, artistImage);
              }}
              
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
            if (isThisTrackPlaying) {
                if (isPlaying) {
                    pause();       
                } else {
                    play();       
                }
            } else {
                setQueue([track]);
                playTrack(track);
            }
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
          {showNowPlaying ? <NowPlayingIcon /> : <PlayIcon />}
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
          {<HeartIcon filled={liked} />}
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
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(280px,400px)",
          gap: "24px",
        }}
      >
        {/* Thông tin bài hát */}
        <div style={{ background: "#181818", borderRadius: "14px", padding: "22px" }}>
          <h2 style={{ color: "#fff", marginBottom: "18px" }}>Thông tin bài hát</h2>

          <InfoRow label="Tên bài" value={track.title} />
          <InfoRow label="Nghệ sĩ" value={artistName} />
          <InfoRow label="Thời lượng" value={formatDuration(track.duration)} />
          <InfoRow label="Thể loại" value={track.genre ?? "Unknown"} />
          <InfoRow label="Loại" value={track.type} />

          {/* ↓ THÊM PHẦN AI Ở ĐÂY */}
          <div style={{ marginTop: "20px" }}>
            {aiStatus === "idle" && (
              <button
                onClick={fetchAiDescription}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border: "1px solid #1DB954",
                  background: "transparent",
                  color: "#1DB954",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                ✨ Tóm tắt bằng AI
              </button>
            )}

            {aiStatus === "loading" && (
              <div>
                <p style={{ color: "#b3b3b3", fontSize: "13px", marginBottom: "10px" }}>
                  ✨ Đang tạo mô tả...
                </p>
                {/* Skeleton */}
                {[100, 85, 65].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: "12px",
                      borderRadius: "4px",
                      background: "#2a2a2a",
                      marginBottom: "8px",
                      width: `${w}%`,
                      animation: "pulse 1.2s ease-in-out infinite",
                    }}
                  />
                ))}
              </div>
            )}

            {aiStatus === "success" && aiDescription && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#1DB954", fontSize: "13px", fontWeight: 700 }}>
                    ✨ Mô tả AI
                  </span>
                  <button
                    onClick={() => { setAiStatus("idle"); setAiDescription(null); }}
                    style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: "14px" }}
                  >
                    ✕
                  </button>
                </div>
                <p style={{ color: "#b3b3b3", lineHeight: 1.8, fontSize: "14px", margin: 0 }}>
                  {aiDescription}
                </p>
              </div>
            )}

            {aiStatus === "error" && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#e74c3c", fontSize: "13px" }}>{aiError}</span>
                <button
                  onClick={fetchAiDescription}
                  style={{
                    background: "none",
                    border: "1px solid #e74c3c",
                    borderRadius: "12px",
                    color: "#e74c3c",
                    fontSize: "12px",
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
          {/* ↑ HẾT PHẦN AI */}
        </div>

        {/* Về nghệ sĩ — giữ nguyên */}
        <div style={{ background: "#181818", borderRadius: "14px", padding: "22px" }}>
          <h2 style={{ color: "#fff", marginBottom: "16px" }}>Về nghệ sĩ</h2>
          <p style={{ color: "#b3b3b3", lineHeight: 1.8 }}>
            {artistName} hiện đang có mặt trên TuneVault...
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
