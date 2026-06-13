import api from "./axios";
import {
  mapNotificationDtoToNotification,
  type NotificationDto,
} from "../types/notification";

export const notificationApi = {
  getAll: async () => {
    const res = await api.get("/Notification");

    const rawData: NotificationDto[] = Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    return rawData.map((item) =>
      mapNotificationDtoToNotification(item),
    );
  },

  markAsRead: (id: number) =>
    api.put(`/Notification/${id}/read`),

  markAllAsRead: () =>
    api.put("/Notification/read-all"),
};