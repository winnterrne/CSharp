import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../hooks/usePlayer";
import { authStore } from "../../store/authStore";

interface VideoPlayerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const VideoPlayer = ({ isOpen, onOpen, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const [videoBlobUrl, setVideoBlobUrl] = useState("");

  const {
    currentTrack,
    isPlaying,
    position,
    volume,
    isMuted,
    repeatMode,
    seek,
    next,
    setDuration,
  } = usePlayer();

  const isVideo = currentTrack?.type === "video";

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
    video.currentTime = 0;
    video.load();
  }, [videoBlobUrl]);

  // Gắn blob vào video theater
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !videoBlobUrl || !isOpen) return;

    video.src = videoBlobUrl;
    video.currentTime = position;
    video.load();
  }, [videoBlobUrl, isOpen]);

  // Play / pause video nhỏ
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoBlobUrl || !isVideo) return;

    // Khi mở theater thì video nhỏ pause để tránh phát 2 video cùng lúc
    if (isOpen) {
      video.pause();
      return;
    }

    if (isPlaying) {
      video.play().catch((err) => {
        console.error("VIDEO PREVIEW PLAY ERROR:", err);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, videoBlobUrl, isVideo, isOpen]);

  // Play / pause video theater
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !videoBlobUrl || !isOpen) return;

    if (isPlaying) {
      video.play().catch((err) => {
        console.error("VIDEO THEATER PLAY ERROR:", err);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, videoBlobUrl, isOpen]);

  // Volume + mute cho video nhỏ
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.max(0, Math.min(1, volume / 100));
    video.muted = isMuted;
  }, [volume, isMuted]);

  // Volume + mute cho video theater
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;

    video.volume = Math.max(0, Math.min(1, volume / 100));
    video.muted = isMuted;
  }, [volume, isMuted]);

  // Sync position cho video nhỏ
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoBlobUrl || !isVideo || isOpen) return;

    if (Math.abs(video.currentTime - position) > 1) {
      video.currentTime = position;
    }
  }, [position, videoBlobUrl, isVideo, isOpen]);

  // Sync position cho theater
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !videoBlobUrl || !isOpen) return;

    if (Math.abs(video.currentTime - position) > 1) {
      video.currentTime = position;
    }
  }, [position, videoBlobUrl, isOpen]);

  if (!currentTrack || !isVideo) {
    return null;
  }

  return (
    <>
      <div
        onClick={onOpen}
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
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => {
            const duration = e.currentTarget.duration;
            if (Number.isFinite(duration)) {
              setDuration(duration);
            }
          }}
          onTimeUpdate={(e) => {
            if (!isOpen) {
              seek(e.currentTarget.currentTime);
            }
          }}
          onEnded={() => {
            const video = videoRef.current;

            if (repeatMode === "one" && video) {
              video.currentTime = 0;
              video.play().catch(console.error);
              return;
            }

            next();
          }}
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

      {isOpen && videoBlobUrl && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: "90px",
            background: "#000",
            zIndex: 150,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
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
              onClick={onClose}
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

          <video
            ref={modalVideoRef}
            poster={currentTrack.thumbnailUrl}
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              const duration = e.currentTarget.duration;
              if (Number.isFinite(duration)) {
                setDuration(duration);
              }
            }}
            onTimeUpdate={(e) => {
              seek(e.currentTarget.currentTime);
            }}
            onEnded={() => {
              const video = modalVideoRef.current;

              if (repeatMode === "one" && video) {
                video.currentTime = 0;
                video.play().catch(console.error);
                return;
              }

              next();
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#000",
              display: "block",
            }}
          />

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

export default VideoPlayer;