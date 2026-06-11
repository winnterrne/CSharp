import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";
import { useHistoryStore } from "../store/historyStore";
import type { Media } from "../types/media";
import { interactionApi } from "../api/interactionApi";

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayer phải dùng trong PlayerProvider");
  }

  const playTrackWithHistory = (track: Media) => {
    ctx.playTrack(track);
    useHistoryStore.getState().addRecentTrack(track);

    const mediaId = Number(track.id);

    if (mediaId) {
      interactionApi.recordPlayHistory(mediaId).catch((error: unknown) => {
        console.error("RECORD PLAY HISTORY ERROR:", error);
      });
    }
  };

  return {
    ...ctx,
    playTrack: playTrackWithHistory,
  };
};