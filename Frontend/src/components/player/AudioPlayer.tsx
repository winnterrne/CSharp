import { useEffect, useRef } from "react";
import { usePlayer } from "../../hooks/usePlayer";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
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

  // đổi bài hát
  // FIX: chỉ load lại audio khi đổi bài, không load lại khi play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

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

    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

  // mute
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.muted = isMuted;
  }, [isMuted]);

  // seek
  useEffect(() => {
    const audio = audioRef.current;

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
      // NEW: Repeat One
      onEnded={() => {
        if (repeatMode === "one") {
          const audio = audioRef.current;

          if (!audio) return;

          audio.currentTime = 0;
          audio.play();

          return;
        }

        next();
      }}
    />
  );
};

export default AudioPlayer;
