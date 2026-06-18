import { create } from "zustand";
import { followApi, type FollowedArtist } from "../api/followApi";

interface FollowStore {
  followedArtists: FollowedArtist[];
  loading: boolean;

  loadFollowedArtists: () => Promise<void>;
  followArtist: (artistId: number, artistName: string, artistImage: string) => Promise<void>;
  unfollowArtist: (artistId: number) => Promise<void>;
  toggleFollow: (artistId: number, artistName: string, artistImage: string) => Promise<void>;
  isFollowing: (artistId: number) => boolean;
}

export const useFollowStore = create<FollowStore>((set, get) => ({
  followedArtists: [],
  loading: false,

  // =========================
  // LOAD FOLLOW LIST
  // =========================
  loadFollowedArtists: async () => {
    try {
      set({ loading: true });

      const data = await followApi.getFollowedArtists();
      set({ followedArtists: data });

    } catch (err) {
      console.error("Load follow error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // =========================
  // FOLLOW
  // =========================
  followArtist: async (artistId, artistName, artistImage) => {
    const current = get().followedArtists;

    if (current.some(a => a.artistID === artistId)) return;

    // optimistic UI
    set({
      followedArtists: [
        ...current,
        { artistID: artistId, artistName, artistImage }
      ]
    });

    try {
      await followApi.followArtist(artistId);
    } catch (err) {
      set({ followedArtists: current });
      console.error("Follow error:", err);
    }
  },

  // =========================
  // UNFOLLOW
  // =========================
  unfollowArtist: async (artistId) => {
    const current = get().followedArtists;

    set({
      followedArtists: current.filter(a => a.artistID !== artistId)
    });

    try {
      await followApi.unfollowArtist(artistId);
    } catch (err) {
      set({ followedArtists: current });
      console.error("Unfollow error:", err);
    }
  },

  // =========================
  // TOGGLE FOLLOW
  // =========================
  toggleFollow: async (artistId, artistName, artistImage) => {
    const isFollowed = get().isFollowing(artistId);

    if (isFollowed) {
      await get().unfollowArtist(artistId);
    } else {
      await get().followArtist(artistId, artistName, artistImage);
    }
  },

  // =========================
  // CHECK FOLLOW STATE
  // =========================
  isFollowing: (artistId) =>
    get().followedArtists.some(a => a.artistID === artistId),
}))