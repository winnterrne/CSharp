    export const ROUTES = {
  // Public
  LOGIN: "/login",

  // Protected
  HOME: "/",
  SEARCH: "/search",
  LIBRARY: "/library",
  PROFILE: "/profile",

  // Dynamic
  PLAYLIST: (id: number | string) => `/playlist/${id}`,
  ARTIST: (id: number | string) => `/artist/${id}`,
  MEDIA: (id: string) => `/media/${id}`,
} as const;

// Static route strings (for <Route path="..."> in AppRoutes.tsx)
export const ROUTE_PATHS = {
  LOGIN: "/login",
  HOME: "/",
  SEARCH: "/search",
  LIBRARY: "/library",
  PROFILE: "/profile",
  PLAYLIST_DETAIL: "/playlist/:id",
  ARTIST_DETAIL: "/artist/:id",
  MEDIA_DETAIL: "/media/:id",
} as const;