import api from "./axios";

export type FollowedArtist = {
  artistID: number;
  artistName: string;
  artistImage: string;
};

export const followApi = {
  // GET LIST
  getFollowedArtists: async (): Promise<FollowedArtist[]> => {
    const res = await api.get("/interaction/follow-artist");
    console.log("FOLLOWED ARTISTS RAW:", res.data);
    return res.data;
  },

  // FOLLOW
  followArtist: async (artistId: number) => {
    const res = await api.post(
      `/interaction/follow/artist/${artistId}`
    );
    return res.data;
  },

  // UNFOLLOW
  unfollowArtist: async (artistId: number) => {
    const res = await api.delete(
      `/interaction/unfollow/artist/${artistId}`
    );
    return res.data;
  },
};