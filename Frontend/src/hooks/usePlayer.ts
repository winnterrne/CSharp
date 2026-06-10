import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";
import { useHistoryStore } from "../store/historyStore";
import type { Media } from "../types/media";

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayer phải dùng trong PlayerProvider");
  }

  // NEW: bọc lại playTrack để mỗi lần phát sẽ lưu vào lịch sử gần đây
  const playTrackWithHistory = (track: Media) => {
    ctx.playTrack(track);

    useHistoryStore.getState().addRecentTrack(track);
  };

  return {
    ...ctx,
    playTrack: playTrackWithHistory,
  };
};