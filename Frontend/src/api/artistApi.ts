import api from "./axios";

export interface ArtistSearchResult {
  artistID: number;
  artistName: string;
  artistImage?: string | null;
  bio?: string | null;
}

export interface ArtistSearchResponse {
  success: boolean;
  data: {
    artists: ArtistSearchResult[];
    totalPages?: number;
  };
}

export const artistApi = {
  getProfile: (artistId: number) =>
    api.get(`/Artist/${artistId}/profile`),

  search: (keyword: string) =>
    api.get<ArtistSearchResponse>("/Artist", {
      params: {
        KeyWord: keyword,
        PageNumber: 1,
        PageSize: 10,
      },
    }),
};