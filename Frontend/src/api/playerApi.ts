import api from "./axios";

export const playerApi = {
  getCurrentTrack: () =>
    api.get("/player/current"),

  play: (trackId: number) =>
    api.post("/player/play", {
      trackId,
    }),

  pause: () =>
    api.post("/player/pause"),

  next: () =>
    api.post("/player/next"),

  previous: () =>
    api.post("/player/previous"),

  seek: (position: number) =>
    api.post("/player/seek", {
      position,
    }),

  setVolume: (volume: number) =>
    api.post("/player/volume", {
      volume,
    }),
};