export const APP_EVENTS = {
  PLAYLIST_UPDATED: "tunevault:playlist-updated",
  FAVORITE_UPDATED: "tunevault:favorite-updated",
} as const;

export const emitPlaylistUpdated = () => {
  window.dispatchEvent(new Event(APP_EVENTS.PLAYLIST_UPDATED));
};

export const emitFavoriteUpdated = () => {
  window.dispatchEvent(new Event(APP_EVENTS.FAVORITE_UPDATED));
};