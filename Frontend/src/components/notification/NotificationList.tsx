import { useEffect } from "react";
import NotificationItem from "./NotificationItem";
import { notificationApi } from "../../api/notificationApi";
import { notificationStore } from "../../store/notificationStore";

type Props = {
  onClose?: () => void;
};

const NotificationList = ({ onClose }: Props) => {
  const notifications = notificationStore((s) => s.notifications);
  const unreadCount = notificationStore((s) => s.unreadCount);
  const isLoading = notificationStore((s) => s.isLoading);

  const setNotifications = notificationStore((s) => s.setNotifications);
  const setLoading = notificationStore((s) => s.setLoading);
  const markAsRead = notificationStore((s) => s.markAsRead);
  const markAllAsRead = notificationStore((s) => s.markAllAsRead);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationApi.getAll();
        setNotifications(data);
      } catch (error) {
        console.error("LOAD NOTIFICATIONS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [setLoading, setNotifications]);

  const handleRead = async (id: number) => {
    const current = notifications.find((n) => n.id === id);

    if (!current || current.isRead) return;

    // Cập nhật FE trước để badge trừ liền
    markAsRead(id);

    try {
      await notificationApi.markAsRead(id);
    } catch (error) {
      console.error("MARK NOTIFICATION READ ERROR:", error);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount <= 0) return;

    markAllAsRead();

    try {
      await notificationApi.markAllAsRead();
    } catch (error) {
      console.error("MARK ALL NOTIFICATIONS READ ERROR:", error);
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;

    return (
      new Date(b.noticedAt).getTime() -
      new Date(a.noticedAt).getTime()
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "46px",
        right: 0,
        width: "380px",
        maxHeight: "520px",
        background: "#181818",
        color: "#fff",
        borderRadius: "14px",
        boxShadow: "0 12px 40px rgba(0,0,0,.65)",
        zIndex: 99999,
        overflow: "hidden",
        border: "1px solid #2a2a2a",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #2a2a2a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "18px" }}>
            Thông báo
          </h3>

          <p
            style={{
              margin: "4px 0 0",
              color: "#b3b3b3",
              fontSize: "13px",
            }}
          >
            {unreadCount > 0
              ? `${unreadCount} thông báo chưa đọc`
              : "Bạn đã đọc hết thông báo"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{
                border: "none",
                background: "#1DB954",
                color: "#000",
                borderRadius: "999px",
                padding: "7px 12px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Đọc tất cả
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#2a2a2a",
              color: "#fff",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "10px",
          maxHeight: "430px",
          overflowY: "auto",
        }}
      >
        {isLoading && (
          <div style={{ padding: "20px", color: "#b3b3b3" }}>
            Đang tải thông báo...
          </div>
        )}

        {!isLoading && sortedNotifications.length === 0 && (
          <div
            style={{
              padding: "28px 12px",
              textAlign: "center",
              color: "#b3b3b3",
            }}
          >
            Chưa có thông báo nào.
          </div>
        )}

        {!isLoading &&
          sortedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={handleRead}
            />
          ))}
      </div>
    </div>
  );
};

export default NotificationList;