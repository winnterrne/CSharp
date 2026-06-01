import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Track } from "../types/media";
import { PlayerContext } from "./PlayerContext";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>({
    id: "1",
    title: "Nhắc Máy",
    artist: "Noo Phước Thịnh",
    duration: 214,
    color: "#1a3050",
    emoji: "📱",
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress]   = useState(38);
  const [volume, setVolume]       = useState(80);
  const [shuffle, setShuffle]     = useState(false);
  const [repeat, setRepeat]       = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.05));
    }, 300);
    return () => clearInterval(id);
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        shuffle,
        repeat,
        setTrack: setCurrentTrack,
        togglePlay: () => setIsPlaying((p) => !p),
        setProgress,
        setVolume,
        toggleShuffle: () => setShuffle((s) => !s),
        toggleRepeat: () => setRepeat((r) => !r),
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};