import { useEffect, useState } from "react";
import { notificationApi } from "../api/notificationApi";

export interface NotificationItem {
  id: number;
  title: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await notificationApi.getAll();
      setNotifications(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    unreadCount: notifications.filter((item) => !item.isRead).length,
    refetch: fetchNotifications,
  };
};