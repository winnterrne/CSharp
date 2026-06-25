import api from "./axios";

export type FollowedArtist = {
  artistID: number;
  artistName: string;
  artistImage: string;
};

export type FollowedUser = {
  userID: string;
  userName: string;
  userImage?: string | null;
  email?: string;
};

export const followApi = {
  // =========================
  // ARTIST
  // =========================

  getFollowedArtists: async (): Promise<FollowedArtist[]> => {
    const res = await api.get("/interaction/follow-artist");
    console.log("FOLLOWED ARTISTS RAW:", res.data);

    return res.data?.data ?? res.data ?? [];
  },

  followArtist: async (artistId: number) => {
    const res = await api.post(`/interaction/follow/artist/${artistId}`);
    return res.data;
  },

  unfollowArtist: async (artistId: number) => {
    const res = await api.delete(`/interaction/unfollow/artist/${artistId}`);
    return res.data;
  },

  // =========================
  // USER
  // =========================

  followUser: async (followingUserId: string) => {
    const res = await api.post(
      `/interaction/follow/user/${followingUserId}`,
    );

    return res.data;
  },

  unfollowUser: async (followingUserId: string) => {
    const res = await api.delete(
      `/interaction/unfollow/user/${followingUserId}`,
    );

    return res.data;
  },

  getFollowedUsers: async (): Promise<FollowedUser[]> => {
    const res = await api.get("/interaction/follow-user");
    console.log("FOLLOWED USERS RAW:", res.data);

    return res.data?.data ?? res.data ?? [];
  },
};