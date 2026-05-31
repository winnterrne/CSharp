// src/contexts/PlayerProvider.tsx
import { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Track } from "../types/media";
import { PlayerContext } from "./PlayerContext";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue,        setQueueState]   = useState<Track[]>([]);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [volume,       setVolumeState]  = useState(70);
  const [shuffle,      setShuffle]      = useState(false);
  const [repeat,       setRepeat]       = useState(false);
  const [liked,        setLiked]        = useState(false);

  // Auto-advance progress khi đang phát
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { setIsPlaying(false); return 0; }
        return p + 100 / ((currentTrack?.duration ?? 214) * (1000 / 300));
      });
    }, 300);
    return () => clearInterval(id);
  }, [isPlaying, currentTrack]);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setLiked(false);
  }, []);

  const setQueue = useCallback((tracks: Track[]) => setQueueState(tracks), []);

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying((p) => !p);
  }, [currentTrack]);

  const seek = useCallback((pct: number) => {
    setProgress(Math.min(100, Math.max(0, pct)));
  }, []);

  const setVolume = useCallback((pct: number) => {
    setVolumeState(Math.min(100, Math.max(0, pct)));
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const toggleRepeat  = useCallback(() => setRepeat((r)  => !r), []);
  const toggleLike    = useCallback(() => setLiked((l)   => !l), []);

  const prev = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    if (idx > 0) playTrack(queue[idx - 1]);
  }, [currentTrack, queue, playTrack]);

  const next = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    if (shuffle) {
      playTrack(queue[Math.floor(Math.random() * queue.length)]);
    } else if (idx < queue.length - 1) {
      playTrack(queue[idx + 1]);
    } else if (repeat) {
      playTrack(queue[0]);
    }
  }, [currentTrack, queue, shuffle, repeat, playTrack]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack, queue, isPlaying, progress, volume, shuffle, repeat, liked,
        playTrack, setQueue, togglePlay, seek, setVolume,
        toggleShuffle, toggleRepeat, toggleLike, prev, next,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};