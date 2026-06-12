<<<<<<< HEAD
import { useEffect, useRef } from "react";
import { usePlayer } from "../../hooks/usePlayer";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
=======
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../hooks/usePlayer";
import { authStore } from "../../store/authStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [blobUrl, setBlobUrl] = useState<string>("");

>>>>>>> origin/vinh-branch
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

<<<<<<< HEAD
  // đổi bài hát
  // FIX: chỉ load lại audio khi đổi bài, không load lại khi play/pause
=======
>>>>>>> origin/vinh-branch
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

<<<<<<< HEAD
    audio.src = currentTrack.url;
    audio.load();

    audio.play().catch(console.error);
  }, [currentTrack]);

  // play / pause
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  // volume
  useEffect(() => {
    const audio = audioRef.current;

=======
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
          throw new Error(`Stream lỗi: ${res.status}`);
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setBlobUrl(objectUrl);
        audio.src = objectUrl;
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
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !blobUrl) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("AUDIO PLAY ERROR:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, blobUrl]);

  useEffect(() => {
    const audio = audioRef.current;
>>>>>>> origin/vinh-branch
    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

<<<<<<< HEAD
  // mute
  useEffect(() => {
    const audio = audioRef.current;

=======
  useEffect(() => {
    const audio = audioRef.current;
>>>>>>> origin/vinh-branch
    if (!audio) return;

    audio.muted = isMuted;
  }, [isMuted]);

<<<<<<< HEAD
  // seek
  useEffect(() => {
    const audio = audioRef.current;

=======
  useEffect(() => {
    const audio = audioRef.current;
>>>>>>> origin/vinh-branch
    if (!audio) return;

    if (Math.abs(audio.currentTime - position) > 1) {
      audio.currentTime = position;
    }
  }, [position]);

  return (
    <audio
      ref={audioRef}
      preload="metadata"
      onLoadedMetadata={(e) => {
        setDuration(e.currentTarget.duration);
      }}
      onTimeUpdate={(e) => {
        seek(e.currentTarget.currentTime);
      }}
<<<<<<< HEAD
      // NEW: Repeat One
      onEnded={() => {
        if (repeatMode === "one") {
          const audio = audioRef.current;

          if (!audio) return;

          audio.currentTime = 0;
          audio.play();

=======
      onEnded={() => {
        const audio = audioRef.current;

        if (repeatMode === "one" && audio) {
          audio.currentTime = 0;
          audio.play().catch(console.error);
>>>>>>> origin/vinh-branch
          return;
        }

        next();
      }}
    />
  );
};

<<<<<<< HEAD
export default AudioPlayer;
=======
export default AudioPlayer;
>>>>>>> origin/vinh-branch
