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

  const playTrackWithHistory = (track: Media, contextId?: string, queue?: Media[]) => {
    const currentTrack = ctx.currentTrack;

    // Chỉ add history khi đổi sang bài khác hoặc khác context
    if (
      !currentTrack ||
      String(currentTrack.id) !== String(track.id) ||
      ctx.playingContextId !== contextId
    ) {
      useHistoryStore.getState().addRecentTrack(track, contextId);

      const mediaId = Number(track.id);
      if (mediaId) {
        interactionApi.recordPlayHistory(mediaId).catch((error: unknown) => {
          console.error("RECORD PLAY HISTORY ERROR:", error);
        });
      }
    }

    ctx.playTrack(track, queue, contextId);
  };

  return {
    ...ctx,
    playTrack: playTrackWithHistory,
  };
};