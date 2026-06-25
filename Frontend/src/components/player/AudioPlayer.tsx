import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../hooks/usePlayer";
import { authStore } from "../../store/authStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [blobUrl, setBlobUrl] = useState<string>("");

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

  const isAudio = currentTrack?.type !== "video";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Nếu không có bài hoặc đang là video thì AudioPlayer không chạy
    if (!currentTrack || !isAudio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setBlobUrl("");
      return;
    }

    let objectUrl = "";
    let cancelled = false;

    const loadAudio = async () => {
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
          throw new Error(`AUDIO STREAM ERROR: ${res.status}`);
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setBlobUrl(objectUrl);
        audio.src = objectUrl;
        audio.currentTime = 0;
        audio.load();

        if (isPlaying) {
          await audio.play();
        }
      } catch (error) {
        console.error("AUDIO LOAD ERROR:", error);
      }
    };

    loadAudio();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentTrack?.id, currentTrack?.url, isAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !blobUrl || !isAudio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("AUDIO PLAY ERROR:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, blobUrl, isAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = Math.max(0, Math.min(1, volume / 100));
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !blobUrl || !isAudio) return;

    if (Math.abs(audio.currentTime - position) > 1) {
      audio.currentTime = position;
    }
  }, [position, blobUrl, isAudio]);

  return (
    <audio
      ref={audioRef}
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
        const audio = audioRef.current;

        if (repeatMode === "one" && audio) {
          audio.currentTime = 0;
          audio.play().catch(console.error);
          return;
        }

        next();
      }}
    />
  );
};

export default AudioPlayer;