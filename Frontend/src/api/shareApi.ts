import api from "./axios";

export type ShareMediaRequest = {
  receiverID: string;
  mediaItemID?: number | null;
  playlistID?: number | null;
};

export type ShareMediaResponse = {
  shareID: number;
  senderID: string;
  receiverID: string;
  mediaItemID?: number | null;
  playlistID?: number | null;
  sharedAt: string;
};

export const shareApi = {
  share: (data: ShareMediaRequest) => api.post("/share", data),

  getReceived: () => api.get("/share/received"),

  getSent: () => api.get("/share/sent"),
};