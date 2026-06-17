import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../hooks/usePlayer";
import { authStore } from "../../store/authStore";

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
};

interface NowPlayingProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;

  // Giữ prop này để MainLayout có truyền vào cũng không bị lỗi.
  // Nhưng trong kiểu Spotify thì không cần dùng nó, vì PlayerBar vẫn hiện.
  onFullscreenChange?: (open: boolean) => void;
}

const NowPlaying = ({
  isCollapsed,
  onToggleCollapse,
}: NowPlayingProps) => {
  const { currentTrack, queue, playTrack, isPlaying, position } = usePlayer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState("");

  const upcomingTracks = queue.filter((track) => track.id !== currentTrack?.id);

  const isVideo = currentTrack?.type === "video";

  const openVideoTheater = () => {
    setIsVideoOpen(true);
  };

  const closeVideoTheater = () => {
    setIsVideoOpen(false);
  };

  // Load video bằng blob vì API stream cần Authorization token
  useEffect(() => {
    if (!currentTrack || !isVideo) {
      setVideoBlobUrl("");
      return;
    }

    let objectUrl = "";
    let cancelled = false;

    const loadVideo = async () => {
      try {
        const token = authStore.getState().token;

        const res = await fetch(currentTrack.url, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        if (!res.ok) {
          throw new Error(`VIDEO STREAM ERROR: ${res.status}`);
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setVideoBlobUrl(objectUrl);
      } catch (error) {
        console.error("VIDEO LOAD ERROR:", error);
        setVideoBlobUrl("");
      }
    };

    loadVideo();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentTrack?.id, currentTrack?.url, isVideo]);

  // Gắn blob vào video nhỏ
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoBlobUrl) return;

    video.src = videoBlobUrl;
    video.load();
  }, [videoBlobUrl]);

  // Play / pause video nhỏ theo player
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoBlobUrl || !isVideo) return;

    if (isPlaying) {
      video.play().catch((err) => {
        console.error("NOWPLAYING VIDEO PLAY ERROR:", err);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, videoBlobUrl, isVideo]);

  // Tua video nhỏ theo position của PlayerBar
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoBlobUrl || !isVideo) return;

    if (Math.abs(video.currentTime - position) > 1) {
      video.currentTime = position;
    }
  }, [position, videoBlobUrl, isVideo]);

  // Khi mở theater video thì sync thời gian theo player
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !videoBlobUrl || !isVideoOpen) return;

    video.currentTime = position;

    if (isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isVideoOpen, videoBlobUrl, position, isPlaying]);

  // Play / pause theater video theo PlayerBar
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !isVideoOpen || !videoBlobUrl) return;

    if (isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying, isVideoOpen, videoBlobUrl]);

  // Tua theater video theo PlayerBar
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !isVideoOpen || !videoBlobUrl) return;

    if (Math.abs(video.currentTime - position) > 1) {
      video.currentTime = position;
    }
  }, [position, isVideoOpen, videoBlobUrl]);

  if (isCollapsed) {
    return (
      <aside
        style={{
          width: "48px",
          height: "100%",
          background: "#121212",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          transition: "width 0.25s ease",
        }}
      >
        <button
          onClick={() => onToggleCollapse()}
          title="Mở thông tin bài hát"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: "#2a2a2a",
            color: "#fff",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ‹
        </button>
      </aside>
    );
  }

  if (!currentTrack) {
    return (
      <aside
        style={{
          width: "320px",
          flexShrink: 0,
          height: "100%",
          background: "#121212",
          borderRadius: "12px",
          padding: "20px",
          color: "#b3b3b3",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <button
          onClick={() => onToggleCollapse()}
          title="Thu gọn"
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "none",
            background: "#2a2a2a",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ‹
        </button>

        <div style={{ paddingTop: "40px" }}>
          Chưa có bài hát nào đang phát 🎵
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside
        style={{
          width: "320px",
          minWidth: "320px",
          height: "100%",
          background: "#121212",
          borderRadius: "12px",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          transition: "width 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => onToggleCollapse()}
            title="Thu gọn thông tin bài hát"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "none",
              background: "#2a2a2a",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              flexShrink: 0,
            }}
          >
            ›
          </button>

          <span>Đang phát</span>
        </div>

        {/* Video / Cover */}
        <div style={{ padding: "16px" }}>
          {isVideo && videoBlobUrl ? (
            <div
              onClick={openVideoTheater}
              title="Bấm để mở video"
              style={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#000",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <video
                ref={videoRef}
                poster={currentTrack.thumbnailUrl}
                muted
                playsInline
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  display: "block",
                  background: "#000",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
                  background: "rgba(0,0,0,0.65)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "6px 10px",
                  fontSize: "13px",
                  pointerEvents: "none",
                }}
              >
                ⛶ Mở video
              </div>
            </div>
          ) : currentTrack.thumbnailUrl ? (
            <img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              style={{
                width: "100%",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "12px",
                background: "#2a2a2a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
              }}
            >
              🎵
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "0 16px 16px" }}>
          <h2
            style={{
              color: "#fff",
              marginBottom: "6px",
              fontSize: "22px",
            }}
          >
            {currentTrack.title}
          </h2>

          <p
            style={{
              color: "#b3b3b3",
              marginBottom: "12px",
            }}
          >
            {currentTrack.artist?.name ?? "Unknown Artist"}
          </p>

          <div
            style={{
              background: "#181818",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            <p style={{ color: "#fff" }}>
              🎵 Thể loại: {currentTrack.genre ?? "Unknown"}
            </p>

            <p style={{ color: "#fff" }}>
              ⏱ Thời lượng: {formatDuration(currentTrack.duration)}
            </p>

            <p style={{ color: "#fff" }}>📃 Hàng chờ: {queue.length} bài</p>
          </div>

          {/* Queue Section */}
          <div
            style={{
              marginTop: "16px",
              background: "#181818",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: "16px",
                marginBottom: "12px",
              }}
            >
              Tiếp theo
            </h3>

            {upcomingTracks.length === 0 ? (
              <p
                style={{
                  color: "#b3b3b3",
                  fontSize: "13px",
                }}
              >
                Không có bài tiếp theo
              </p>
            ) : (
              upcomingTracks.slice(0, 5).map((track) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "6px",
                  }}
                >
                  {track.thumbnailUrl ? (
                    <img
                      src={track.thumbnailUrl}
                      alt={track.title}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        background: "#2a2a2a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {track.type === "video" ? "🎬" : "🎵"}
                    </div>
                  )}

                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.title}
                    </div>

                    <div
                      style={{
                        color: "#b3b3b3",
                        fontSize: "12px",
                      }}
                    >
                      {track.artist?.name ?? "Unknown Artist"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Theater video: phủ app nhưng chừa PlayerBar 90px ở dưới */}
      {isVideoOpen && isVideo && videoBlobUrl && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: "90px",
            background: "#000",

            // PlayerBar đang zIndex 200, nên modal để 150 để PlayerBar nổi lên trên.
            zIndex: 150,

            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header trên video */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "86px",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 34px",
              boxSizing: "border-box",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: "22px",
                fontWeight: 800,
                maxWidth: "60%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentTrack.title}
            </div>

            <button
              onClick={closeVideoTheater}
              title="Đóng video"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.45)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "34px",
                lineHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          {/* Video chính, không controls mặc định */}
          <video
            ref={modalVideoRef}
            src={videoBlobUrl}
            poster={currentTrack.thumbnailUrl}
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#000",
              display: "block",
            }}
          />

          {/* Lớp tối nhẹ dưới đáy */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "120px",
              pointerEvents: "none",
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>
      )}
    </>
  );
};

export default NowPlaying;