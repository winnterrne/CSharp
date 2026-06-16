import type { Notification } from "../../types/notification";
import type { Media } from "../../types/media";
import { useNavigate } from "react-router-dom";

type Props = {
  notification: Notification;
  onRead: (id: number) => void;
  mediaMap?: Record<string, Media>;
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

const parsePayload = (payload: string) => {
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const NotificationItem = ({
  notification,
  onRead,
  mediaMap = {},
}: Props) => {
  const navigate = useNavigate();
  const data = parsePayload(notification.payload);

  const mediaId = data?.mediaItemID ? String(data.mediaItemID) : "";
  const media = mediaId ? mediaMap[mediaId] : undefined;

  const title =
    data?.mediaTitle ??
    media?.title ??
    (mediaId ? `Bài hát #${mediaId}` : notification.payload);

  const artist =
    data?.artistName ??
    media?.artist?.name ??
    "";

  const imageUrl =
    data?.imageUrl ??
    media?.thumbnailUrl ??
    "";

  return (
    <div
      onClick={() => {
        if (!notification.isRead) {
          onRead(notification.id);
        }

        if (notification.type === "share" && mediaId) {
          navigate(`/notifications?mediaId=${mediaId}`);
        }
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr",
        gap: "14px",
        padding: "14px",
        borderRadius: "12px",
        background: notification.isRead ? "transparent" : "#1f1f1f",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "8px",
          background: "#282828",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b3b3b3",
          fontSize: "24px",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          "🎵"
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
          }}
        >
          {title}
        </div>

        {artist && (
          <div
            style={{
              color: "#b3b3b3",
              fontSize: "13px",
              marginTop: "3px",
            }}
          >
            {artist}
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
    </div>
  );
};

export default NotificationItem;