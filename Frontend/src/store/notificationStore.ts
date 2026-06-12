import { create } from "zustand";
import type { Notification, NotificationState } from "../types/notification";

interface NotificationStore extends NotificationState {
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
  updateNotification: (id: number, updates: Partial<Notification>) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;

  // Bulk actions
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const notificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    })),

  removeNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification?.isRead
          ? state.unreadCount
          : Math.max(0, state.unreadCount - 1),
      };
    }),

  updateNotification: (id, updates) =>
    set((state) => {
      const oldNotif = state.notifications.find((n) => n.id === id);
      const wasRead = oldNotif?.isRead ?? false;
      const willBeRead = updates.isRead ?? wasRead;

      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, ...updates } : n
        ),
        unreadCount:
          !wasRead && willBeRead
            ? Math.max(0, state.unreadCount - 1)
            : wasRead && !willBeRead
            ? state.unreadCount + 1
            : state.unreadCount,
      };
    }),

  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setLoading: (isLoading) => set({ isLoading }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(
        0,
        state.notifications.find((n) => n.id === id && !n.isRead)
          ? state.unreadCount - 1
          : state.unreadCount
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));