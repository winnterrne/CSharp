import api from "./axios";

export const userApi = {
  getProfile: () =>
    api.get("/users/profile"),

  updateProfile: (data: {
    username?: string;
    email?: string;
    //phoneNumber?: string;
    avatarUrl?: string;
  }) =>
    api.put("/users/profile", data),

  uploadAvatar: (formData: FormData) =>
    api.post(
      "/users/avatar",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    ),

  getFollowers: () =>
    api.get("/users/followers"),

  getFollowing: () =>
    api.get("/users/following"),

  followArtist: (artistId: number) =>
    api.post(`/users/follow/${artistId}`),

  unfollowArtist: (artistId: number) =>
    api.delete(`/users/follow/${artistId}`),
};