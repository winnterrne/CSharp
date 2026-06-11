import { interactionApi } from "./interactionApi";
import { mediaApi } from "./mediaApi";

export const playerApi = {
  getStreamUrl: mediaApi.getStreamUrl,

  saveHistory: (mediaItemId: number) =>
    interactionApi.recordPlayHistory(mediaItemId),

  getRecentlyPlayed: (limit = 10) =>
    interactionApi.getPlayHistory(limit),
};