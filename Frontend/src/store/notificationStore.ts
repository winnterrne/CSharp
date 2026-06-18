import { create } from "zustand";
import type { Notification } from "../types/notification";

type NotificationStore = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
  updateNotification: (
    id: number,
    updates: Partial<Notification>,
  ) => void;

  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
};

const countUnread = (notifications: Notification[]) => {
  return notifications.filter((item) => !item.isRead).length;
};

const sortNotifications = (notifications: Notification[]) => {
  return [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }

    return (
      new Date(b.noticedAt).getTime() -
      new Date(a.noticedAt).getTime()
    );
  });
};

export const notificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setNotifications: (notifications) => {
    const sorted = sortNotifications(notifications);

    set({
      notifications: sorted,
      unreadCount: countUnread(sorted),
      error: null,
    });
  },

  addNotification: (notification) =>
    set((state) => {
      // ✅ tránh SignalR bắn trùng ID
      const existed = state.notifications.some(
        (item) => item.id === notification.id,
      );

      let nextNotifications: Notification[];

      if (existed) {
        nextNotifications = state.notifications.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                ...notification,
              }
            : item,
        );
      } else {
        nextNotifications = [notification, ...state.notifications];
      }

      const sorted = sortNotifications(nextNotifications);

      return {
        notifications: sorted,
        unreadCount: countUnread(sorted),
        error: null,
      };
    }),

  removeNotification: (id) =>
    set((state) => {
      const nextNotifications = state.notifications.filter(
        (item) => item.id !== id,
      );

      return {
        notifications: nextNotifications,
        unreadCount: countUnread(nextNotifications),
      };
    }),

  updateNotification: (id, updates) =>
    set((state) => {
      const nextNotifications = state.notifications.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      );

      const sorted = sortNotifications(nextNotifications);

      return {
        notifications: sorted,
        unreadCount: countUnread(sorted),
      };
    }),

  setUnreadCount: (count) =>
    set({
      unreadCount: Math.max(0, count),
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  markAsRead: (id) =>
    set((state) => {
      const nextNotifications = state.notifications.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: true,
            }
          : item,
      );

      return {
        notifications: nextNotifications,
        unreadCount: countUnread(nextNotifications),
      };
    }),

  markAllAsRead: () =>
    set((state) => {
      const nextNotifications = state.notifications.map((item) => ({
        ...item,
        isRead: true,
      }));

      return {
        notifications: nextNotifications,
        unreadCount: 0,
      };
    }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
    }),
}));