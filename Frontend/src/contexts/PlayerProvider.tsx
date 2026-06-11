import { useEffect, useRef, type ReactNode } from "react";
import type { Media } from "../types/media";
import { PlayerContext } from "./PlayerContext";
import { playerStore } from "../store/playerStore";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State từ playerStore
  const currentTrack = playerStore((state) => state.currentTrack);
  const queue = playerStore((state) => state.queue);
  const isPlaying = playerStore((state) => state.isPlaying);
  const position = playerStore((state) => state.position);
  const duration = playerStore((state) => state.duration);
  const volume = playerStore((state) => state.volume);
  const isMuted = playerStore((state) => state.isMuted);
  const isShuffle = playerStore((state) => state.isShuffle);
  const repeatMode = playerStore((state) => state.repeatMode);
  const isLoading = playerStore((state) => state.isLoading);

  // Actions từ playerStore
  const setQueue = playerStore((state) => state.setQueue);
  const setDuration = playerStore((state) => state.setDuration);
  const togglePlay = playerStore((state) => state.togglePlay);
  const play = playerStore((state) => state.play);
  const pause = playerStore((state) => state.pause);
  // const seek = playerStore((state) => state.seek);
  const setVolume = playerStore((state) => state.setVolume);
  const setMuted = playerStore((state) => state.setMuted);
  const toggleShuffle = playerStore((state) => state.toggleShuffle);
  const toggleRepeatMode = playerStore((state) => state.toggleRepeatMode);
  const next = playerStore((state) => state.next);
  const previous = playerStore((state) => state.previous);
  const addToQueue = playerStore((state) => state.addToQueue);
  const removeFromQueue = playerStore((state) => state.removeFromQueue);
  const clearQueue = playerStore((state) => state.clearQueue);

  const handlePlayTrack = (track: Media) => {
    const state = playerStore.getState();

    state.setCurrentTrack(track);

    if (
      state.queue.length === 0 ||
      !state.queue.some((t) => t.id === track.id)
    ) {
      state.setQueue([track]);
    }

    state.seek(0);
    state.play();
  };
  const handleTogglePlay = () => {
    if (!currentTrack) return;
    togglePlay();
  };

  const handleSeek = (nextPosition: number) => {
    const safePosition = Math.max(0, nextPosition);

    playerStore.getState().seek(safePosition);

    if (audioRef.current) {
      audioRef.current.currentTime = safePosition;
    }
  };

  const handleNext = () => {
    const currentId = playerStore.getState().currentTrack?.id;

    next();

    const nextTrack = playerStore.getState().currentTrack;

    if (nextTrack && nextTrack.id !== currentId) {
      playerStore.getState().play();
    }
  };
  const handlePrevious = () => {
    const audio = audioRef.current;

    if (audio && audio.currentTime > 5) {
      audio.currentTime = 0;

      playerStore.getState().seek(0);

      return;
    }

    previous();

    playerStore.getState().play();
  };

  // Khi đổi bài hát thì gắn src mới cho audio
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) return;

    audio.src = currentTrack.url;
    audio.currentTime = 0;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("AUDIO PLAY ERROR:", err);
        playerStore.getState().pause();
      });
    }
  }, [currentTrack]);

  // Khi bấm play / pause
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("AUDIO PLAY ERROR:", err);
        playerStore.getState().pause();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Đồng bộ volume và mute
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = Math.max(0, Math.min(1, volume / 100));
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Event audio: duration, progress, hết bài
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        playerStore.getState().setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      playerStore.getState().setPosition(audio.currentTime);
    };

    const handleEnded = () => {
      const state = playerStore.getState();

      if (state.repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(console.error);
        return;
      }

      state.next();

      const nextTrack = playerStore.getState().currentTrack;

      if (!nextTrack || nextTrack.id === currentTrack?.id) {
        playerStore.getState().pause();
        playerStore.getState().seek(0);
      } else {
        playerStore.getState().play();
      }
    };

    const handleError = () => {
      console.error("AUDIO LOAD ERROR:", {
        track: currentTrack,
        src: audio.src,
        error: audio.error,
      });

      playerStore.getState().pause();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [currentTrack]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        position,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        isLoading,
        playTrack: handlePlayTrack,
        setQueue,
        togglePlay: handleTogglePlay,
        play,
        pause,
        seek: handleSeek,
        setVolume,
        setMuted,
        toggleShuffle,
        toggleRepeatMode,
        next: handleNext,
        previous: handlePrevious,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setDuration,
      }}
    >
      {children}

      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
};
