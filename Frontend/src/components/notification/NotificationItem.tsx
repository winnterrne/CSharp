import type { Notification } from "../../types/notification";
import {
  parseNotificationPayload,
} from "../../types/notification";

type Props = {
  notification: Notification;
  onOpen: (notification: Notification) => void;
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

const getIcon = (type: string) => {
  if (type === "share_song") return "🎵";
  if (type === "share_playlist") return "📃";
  if (type === "follow") return "👤";
  return "🔔";
};

const NotificationItem = ({
  notification,
  onOpen,
}: Props) => {
  const data =
    parseNotificationPayload(notification.payload);

  const mainTitle =
    data.mediaTitle ??
    data.playlistName ??
    data.followerName ??
    notification.title;

  const subTitle =
    notification.type === "share_song"
      ? data.artistName
      : notification.type === "share_playlist"
        ? `${data.trackCount ?? 0} bài hát`
        : notification.type === "follow"
          ? "Đã bắt đầu theo dõi bạn"
          : "";

  const imageUrl = (() => {
  const raw =
    data.imageUrl ??
    data.senderAvatar ??
    data.followerAvatar ??
    "";

  if (!raw || raw.startsWith("http")) return raw;

  // Song thumbnail → /media/images/media/...
  // Avatar         → /media/images/users/...
  const isAvatar = notification.type === "follow" || (!data.imageUrl && data.senderAvatar);
  const folder = isAvatar ? "users" : "media";

  return `http://localhost:5081/media/images/${folder}/${raw}`;
})();

  return (
    <div
      // ✅ NOTIFICATION FLOW: click item mở track/playlist/follow
      onClick={() => onOpen(notification)}
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr 10px",
        gap: "14px",
        padding: "14px",
        borderRadius: "12px",
        background: notification.isRead
          ? "transparent"
          : "#1f1f1f",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius:
            notification.type === "follow" ? "50%" : "8px",
          background: "#282828",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b3b3b3",
          fontSize: "24px",
          flexShrink: 0,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={mainTitle}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          getIcon(notification.type)
        )}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: notification.isRead ? 600 : 800,
            marginBottom: "5px",
          }}
        >
          {notification.title}
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: "15px",
            fontWeight: 800,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {mainTitle}
        </div>

        {subTitle && (
          <div
            style={{
              color: "#b3b3b3",
              fontSize: "13px",
              marginTop: "3px",
            }}
          >
            {subTitle}
          </div>
        )}

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
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: "#1DB954",
            alignSelf: "center",
          }}
        />
      )}
    </div>
  );
};

export default NotificationItem;