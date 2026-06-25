export const BASE_URL = "https://localhost:5001/api";


// Các endpoint API
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
  },
  
  // User
  USER: {
    PROFILE: "/users/profile",
    AVATAR: "/users/avatar",
    FOLLOWERS: "/users/followers",
    FOLLOWING: "/users/following",
    FOLLOW: (artistId: number) => `/users/follow/${artistId}`,
  },

  // Media
  MEDIA: {
    RECOMMENDED: "/media/recommended",
    FOR_YOU: "/media/for-you",
    UPCOMING: "/media/upcoming",
    BY_ID: (id: string) => `/media/${id}`,
    SEARCH: (query: string) => `/media/search?q=${encodeURIComponent(query)}`,
  },

  // Playlist
  PLAYLIST: {
    MY: "/playlist/my",
    BY_ID: (id: number) => `/playlist/${id}`,
    CREATE: "/playlist",
    UPDATE: (id: number) => `/playlist/${id}`,
    DELETE: (id: number) => `/playlist/${id}`,
    ADD_TRACK: (playlistId: number) => `/playlist/${playlistId}/tracks`,
    REMOVE_TRACK: (playlistId: number, trackId: number) =>
      `/playlist/${playlistId}/tracks/${trackId}`,
  },

  // Player
  PLAYER: {
    CURRENT: "/player/current",
    PLAY: "/player/play",
    PAUSE: "/player/pause",
    NEXT: "/player/next",
    PREVIOUS: "/player/previous",
    SEEK: "/player/seek",
    VOLUME: "/player/volume",
  },

  // Notifications
  NOTIFICATION: {
    ALL: "/notifications",
    UNREAD: "/notifications/unread",
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
  },
} as const;