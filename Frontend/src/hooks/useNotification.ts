import { useCallback, useEffect, useState } from "react";
import { notificationApi } from "../api/notificationApi";
import type { Notification } from "../types/notification";

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await notificationApi.getAll();

      setNotifications(data);
      setUnreadCount(data.filter((item) => !item.isRead).length);
    } catch (err) {
      console.error("LOAD NOTIFICATIONS ERROR:", err);
      setNotifications([]);
      setUnreadCount(0);
      setError("Không tải được thông báo.");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("MARK READ ERROR:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("MARK ALL READ ERROR:", err);
    }
  };



  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};