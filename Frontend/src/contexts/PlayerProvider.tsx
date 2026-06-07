import type { ReactNode } from "react";
import type { Media } from "../types/media";
import { PlayerContext } from "./PlayerContext";
import { playerStore } from "../store/playerStore";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  // Subscribe to playerStore
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
  const setDuration = playerStore((state) => state.setDuration);

  // Actions from store
  const playTrack = playerStore((state) => state.setCurrentTrack);
  const setQueue = playerStore((state) => state.setQueue);
  const togglePlay = playerStore((state) => state.togglePlay);
  const play = playerStore((state) => state.play);
  const pause = playerStore((state) => state.pause);
  const seek = playerStore((state) => state.seek);
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
    playerStore.getState().setCurrentTrack(track);
    playerStore.getState().play();
    playerStore.getState().seek(0);
  };

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
        togglePlay,
        play,
        pause,
        seek,
        setVolume,
        setMuted,
        toggleShuffle,
        toggleRepeatMode,
        next,
        previous,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setDuration,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};