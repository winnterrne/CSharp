import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NotificationItem from "./NotificationItem";
import { notificationApi } from "../../api/notificationApi";
import { notificationStore } from "../../store/notificationStore";
import { mediaApi } from "../../api/mediaApi";
import {
  parseNotificationPayload,
  type Notification,
} from "../../types/notification";
import { mapMediaItemDtoToMedia } from "../../types/media";

type Props = {
  onClose?: () => void;
  onViewAll?: () => void;
};

const NotificationList = ({ onClose, onViewAll }: Props) => {
  const navigate = useNavigate();

  const notifications = notificationStore((s) => s.notifications);

  const unreadCount = notificationStore((s) => s.unreadCount);

  const isLoading = notificationStore((s) => s.isLoading);

  const setNotifications = notificationStore((s) => s.setNotifications);

  const setLoading = notificationStore((s) => s.setLoading);

  const markAsReadStore = notificationStore((s) => s.markAsRead);

  const markAllAsReadStore = notificationStore((s) => s.markAllAsRead);

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

  const markReadIfNeeded = async (notification: Notification) => {
    if (notification.isRead) return;

    markAsReadStore(notification.id);

    try {
      await notificationApi.markAsRead(notification.id);
    } catch (error) {
      console.error("MARK NOTIFICATION READ ERROR:", error);
    }
  };

  const openTrackInMainContent = async (mediaItemID: number) => {
    const res = await mediaApi.getById(String(mediaItemID));
    const dto = res.data?.data ?? res.data;
    const track = mapMediaItemDtoToMedia(dto);

    // ✅ NOTIFICATION FLOW: lưu tạm để MainContent mở sau khi navigate("/")
    sessionStorage.setItem(
      "tunevault:pending-open-track",
      JSON.stringify(track),
    );

    navigate("/");

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("tunevault:open-track", {
          detail: track,
        }),
      );
    }, 80);
  };
  const handleOpenNotification = async (notification: Notification) => {
    const data = parseNotificationPayload(notification.payload);

    await markReadIfNeeded(notification);

    const isShareSong =
      notification.type === "share_song" ||
      (notification.type === "share" && data.mediaItemID);

    const isSharePlaylist =
      notification.type === "share_playlist" ||
      (notification.type === "share" && data.playlistID);

    if (isShareSong && data.mediaItemID) {
      await openTrackInMainContent(data.mediaItemID);
      onClose?.();
      return;
    }

    if (isSharePlaylist && data.playlistID) {
      navigate(`/playlist/${data.playlistID}`);
      onClose?.();
      return;
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount <= 0) return;

    markAllAsReadStore();

    try {
      await notificationApi.markAllAsRead();
    } catch (error) {
      console.error("MARK ALL NOTIFICATIONS READ ERROR:", error);
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }

    return new Date(b.noticedAt).getTime() - new Date(a.noticedAt).getTime();
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "46px",
        right: 0,
        width: "390px",
        maxHeight: "540px",
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
          <button
            onClick={onViewAll}
            style={{
              margin: 0,
              padding: 0,
              border: "none",
              background: "transparent",
              color: "#fff",
              fontSize: "18px",
              fontWeight: 800,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Thông báo
          </button>

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
          maxHeight: "450px",
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
              onOpen={handleOpenNotification}
            />
          ))}

        {!isLoading && sortedNotifications.length > 0 && (
          <button
            onClick={onViewAll}
            style={{
              width: "100%",
              marginTop: "10px",
              border: "none",
              background: "#2a2a2a",
              color: "#fff",
              borderRadius: "999px",
              padding: "10px 12px",
              fontSize: "13px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Xem tất cả thông báo
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
