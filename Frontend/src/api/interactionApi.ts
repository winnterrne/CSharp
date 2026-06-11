import api from "./axios";

export const interactionApi = {
  recordPlayHistory: (mediaItemId: number) =>
    api.post("/Interaction/playhistory", {
      mediaItemID: mediaItemId,
    }),

  getPlayHistory: (limit = 10) =>
    api.get(`/Interaction/playhistory?limit=${limit}`),

  followArtist: (artistId: number) =>
    api.post(`/Interaction/follow/artist/${artistId}`),

  unfollowArtist: (artistId: number) =>
    api.delete(`/Interaction/unfollow/artist/${artistId}`),

  followUser: (followingUserId: string) =>
    api.post(`/Interaction/follow/user/${followingUserId}`),

  unfollowUser: (followingUserId: string) =>
    api.delete(`/Interaction/unfollow/user/${followingUserId}`),
};