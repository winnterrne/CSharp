import { useCallback, useEffect } from "react";
import { notificationApi } from "../api/notificationApi";
import { notificationStore } from "../store/notificationStore";

export const useNotification = () => {
  const notifications = notificationStore((s) => s.notifications);
  const unreadCount = notificationStore((s) => s.unreadCount);
  const loading = notificationStore((s) => s.isLoading);
  const error = notificationStore((s) => s.error);

  const setNotifications = notificationStore((s) => s.setNotifications);
  const setLoading = notificationStore((s) => s.setLoading);
  const setError = notificationStore((s) => s.setError);

  const markAsReadStore = notificationStore((s) => s.markAsRead);
  const markAllAsReadStore = notificationStore((s) => s.markAllAsRead);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await notificationApi.getAll();

      setNotifications(data);
    } catch (err) {
      console.error("LOAD NOTIFICATIONS ERROR:", err);

      setNotifications([]);
      setError("Không tải được thông báo.");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setNotifications]);

  const markAsRead = useCallback(
    async (id: number) => {
      // ✅ cập nhật store ngay để Page + Dropdown + Header cùng đổi
      markAsReadStore(id);

      try {
        await notificationApi.markAsRead(id);
      } catch (err) {
        console.error("MARK READ ERROR:", err);

        // lỗi thì fetch lại DB cho đúng
        await fetchNotifications();
      }
    },
    [markAsReadStore, fetchNotifications],
  );

  const markAllAsRead = useCallback(async () => {
    markAllAsReadStore();

    try {
      await notificationApi.markAllAsRead();
    } catch (err) {
      console.error("MARK ALL READ ERROR:", err);

      // lỗi thì fetch lại DB cho đúng
      await fetchNotifications();
    }
  }, [markAllAsReadStore, fetchNotifications]);

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