import { create } from "zustand";
import {
  followApi,
  type FollowedArtist,
  type FollowedUser,
} from "../api/followApi";

interface FollowStore {
  followedArtists: FollowedArtist[];
  followedUsers: FollowedUser[];
  loading: boolean;

  // LOAD
  loadFollowedArtists: () => Promise<void>;
  loadFollowedUsers: () => Promise<void>;
  loadFollowing: () => Promise<void>;

  // ARTIST
  followArtist: (
    artistId: number,
    artistName: string,
    artistImage: string,
  ) => Promise<void>;

  unfollowArtist: (artistId: number) => Promise<void>;

  toggleFollow: (
    artistId: number,
    artistName: string,
    artistImage: string,
  ) => Promise<void>;

  isFollowing: (artistId: number) => boolean;

  // USER
  followUser: (
    userId: string,
    userName: string,
    userImage?: string | null,
  ) => Promise<void>;

  unfollowUser: (userId: string) => Promise<void>;

  toggleFollowUser: (
    userId: string,
    userName: string,
    userImage?: string | null,
  ) => Promise<void>;

  isFollowingUser: (userId: string) => boolean;
}

export const useFollowStore = create<FollowStore>((set, get) => ({
  followedArtists: [],
  followedUsers: [],
  loading: false,

  // =========================
  // LOAD ARTIST
  // =========================
  loadFollowedArtists: async () => {
    try {
      set({ loading: true });

      const data = await followApi.getFollowedArtists();

      set({ followedArtists: data });
    } catch (err) {
      console.error("Load followed artists error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // =========================
  // LOAD USER
  // =========================
  loadFollowedUsers: async () => {
    try {
      set({ loading: true });

      const data = await followApi.getFollowedUsers();

      set({ followedUsers: data });
    } catch (err) {
      console.error("Load followed users error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // =========================
  // LOAD CHUNG ARTIST + USER
  // =========================
  loadFollowing: async () => {
    try {
      set({ loading: true });

      const [artists, users] = await Promise.all([
        followApi.getFollowedArtists(),
        followApi.getFollowedUsers(),
      ]);

      set({
        followedArtists: artists,
        followedUsers: users,
      });
    } catch (err) {
      console.error("Load following error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // =========================
  // FOLLOW ARTIST
  // =========================
  followArtist: async (artistId, artistName, artistImage) => {
    const current = get().followedArtists;

    if (current.some((a) => a.artistID === artistId)) return;

    set({
      followedArtists: [
        ...current,
        {
          artistID: artistId,
          artistName,
          artistImage,
        },
      ],
    });

    try {
      await followApi.followArtist(artistId);
    } catch (err) {
      set({ followedArtists: current });
      console.error("Follow artist error:", err);
    }
  },

  unfollowArtist: async (artistId) => {
    const current = get().followedArtists;

    set({
      followedArtists: current.filter((a) => a.artistID !== artistId),
    });

    try {
      await followApi.unfollowArtist(artistId);
    } catch (err) {
      set({ followedArtists: current });
      console.error("Unfollow artist error:", err);
    }
  },

  toggleFollow: async (artistId, artistName, artistImage) => {
    const isFollowed = get().isFollowing(artistId);

    if (isFollowed) {
      await get().unfollowArtist(artistId);
    } else {
      await get().followArtist(artistId, artistName, artistImage);
    }
  },

  isFollowing: (artistId) =>
    get().followedArtists.some((a) => a.artistID === artistId),

  // =========================
  // FOLLOW USER
  // =========================
  followUser: async (userId, userName, userImage) => {
    const current = get().followedUsers;

    if (current.some((u) => u.userID === userId)) return;

    set({
      followedUsers: [
        ...current,
        {
          userID: userId,
          userName,
          userImage,
        },
      ],
    });

    try {
      await followApi.followUser(userId);
    } catch (err) {
      set({ followedUsers: current });
      console.error("Follow user error:", err);
    }
  },

  unfollowUser: async (userId) => {
    const current = get().followedUsers;

    set({
      followedUsers: current.filter((u) => u.userID !== userId),
    });

    try {
      await followApi.unfollowUser(userId);
    } catch (err) {
      set({ followedUsers: current });
      console.error("Unfollow user error:", err);
    }
  },

  toggleFollowUser: async (userId, userName, userImage) => {
    const isFollowed = get().isFollowingUser(userId);

    if (isFollowed) {
      await get().unfollowUser(userId);
    } else {
      await get().followUser(userId, userName, userImage);
    }
  },

  isFollowingUser: (userId) =>
    get().followedUsers.some((u) => u.userID === userId),
}));