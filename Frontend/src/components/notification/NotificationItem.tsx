import type { Notification } from "../../types/notification";

type Props = {
  notification: Notification;
  onRead: (id: number) => void;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "new_release":
      return "♪";
    case "follow":
      return "👤";
    case "playlist_update":
      return "▤";
    case "share":
      return "↗";
    default:
      return "●";
  }
};

const NotificationItem = ({ notification, onRead }: Props) => {
  return (
    <div
      onClick={() => {
        if (!notification.isRead) {
          onRead(notification.id);
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px",
        borderRadius: "10px",
        background: notification.isRead ? "transparent" : "#1f1f1f",
        cursor: "pointer",
        transition: ".15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          notification.isRead ? "#1a1a1a" : "#2a2a2a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          notification.isRead ? "transparent" : "#1f1f1f";
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "8px",
          background: "#282828",
          flexShrink: 0,
          overflow: "hidden",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: 800,
        }}
      >
        {/* {notification.imageUrl ?
          <img
            src={notification.imageUrl}
            alt={notification.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        : getIcon(notification.type)} */}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: notification.isRead ? 600 : 800,
            marginBottom: "4px",
          }}
        >
          {notification.title}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          {notification.payload}
        </div>

        <div
          style={{
            color: "#727272",
            fontSize: "12px",
            marginTop: "6px",
          }}
        >
          {formatDate(notification.noticedAt)}
        </div>
      </div>

      {!notification.isRead && (
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#1DB954",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
};

export default NotificationItem;
