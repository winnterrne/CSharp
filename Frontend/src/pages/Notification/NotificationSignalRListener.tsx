import { useEffect } from "react";
import { startNotificationSignalR } from "../../api/notificationSignalR";
import { notificationApi } from "../../api/notificationApi";
import { notificationStore } from "../../store/notificationStore";

const NotificationSignalRListener = () => {
  const setNotifications = notificationStore((s) => s.setNotifications);
  const setLoading = notificationStore((s) => s.setLoading);
  const setError = notificationStore((s) => s.setError);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const token = localStorage.getItem("token");

      console.log("NOTIFICATION LISTENER MOUNTED");
      console.log("NOTIFICATION TOKEN:", token ? "HAS TOKEN" : "NO TOKEN");

      if (!token) {
        console.warn("Không có token nên chưa start notification SignalR");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const notifications = await notificationApi.getAll();

        if (isMounted) {
          setNotifications(notifications);
        }

        await startNotificationSignalR();
      } catch (error) {
        console.error("INIT NOTIFICATION SIGNALR ERROR:", error);

        if (isMounted) {
          setError("Không thể khởi tạo thông báo");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [setNotifications, setLoading, setError]);

  return null;
};

export default NotificationSignalRListener;