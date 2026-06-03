import { useCallback } from "react";
import { notificationStore } from "../store/notificationStore";
import type { Notification } from "../types/notification";

export const useNotification = () => {
  const notifications = notificationStore((state) => state.notifications);
  const unreadCount = notificationStore((state) => state.unreadCount);
  const isLoading = notificationStore((state) => state.isLoading);

  const setNotifications = useCallback((notifs: Notification[]) => {
    notificationStore.getState().setNotifications(notifs);
  }, []);

  const addNotification = useCallback((notif: Notification) => {
    notificationStore.getState().addNotification(notif);
  }, []);

  const removeNotification = useCallback((id: number) => {
    notificationStore.getState().removeNotification(id);
  }, []);

  const updateNotification = useCallback((id: number, updates: Partial<Notification>) => {
    notificationStore.getState().updateNotification(id, updates);
  }, []);

  const markAsRead = useCallback((id: number) => {
    notificationStore.getState().markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    notificationStore.getState().markAllAsRead();
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    notificationStore.getState().setLoading(loading);
  }, []);

  const clearAll = useCallback(() => {
    notificationStore.getState().clearAll();
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    setNotifications,
    addNotification,
    removeNotification,
    updateNotification,
    markAsRead,
    markAllAsRead,
    setLoading,
    clearAll,
  };
};