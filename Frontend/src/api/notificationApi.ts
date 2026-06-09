import api from "./axios";
import {
  mapNotificationDtoToNotification,
  type NotificationDto,
} from "../types/notification";

export const notificationApi = {
  getAll: async () => {
    const res = await api.get("/Notification");

    const rawData = Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    return rawData.map((item: NotificationDto) =>
      mapNotificationDtoToNotification(item)
    );
  },

  markAsRead: async (id: number) => {
    return api.put(`/Notification/${id}/read`);
  },

  markAllAsRead: async () => {
    return api.put("/Notification/read-all");
  },
};