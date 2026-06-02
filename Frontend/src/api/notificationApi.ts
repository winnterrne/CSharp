import api from "./axios";

export const notificationApi = {
  getAll: () =>
    api.get("/notifications"),

  getUnread: () =>
    api.get("/notifications/unread"),

  markAsRead: (id: number) =>
    api.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.put("/notifications/read-all"),
};