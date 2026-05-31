// api/mediaApi.ts
import api from "./axios";  
// api/mediaApi.ts
export const getRecommended = () => api.get("/media/recommended");
export const getLibrary = () => api.get("/playlists/my");
export const getQueue = () => api.get("/player/queue");