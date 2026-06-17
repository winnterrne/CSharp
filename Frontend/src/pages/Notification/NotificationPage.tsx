import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NotificationItem from "../../components/notification/NotificationItem";
import { useNotification } from "../../hooks/useNotification";
// import { notificationApi } from "../../api/notificationApi";
import { mediaApi } from "../../api/mediaApi";
import { mapMediaItemDtoToMedia } from "../../types/media";
import {
  parseNotificationPayload,
  type Notification,
} from "../../types/notification";

const NotificationPage = () => {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotification();

  // ✅ NOTIFICATION FLOW: refresh lại khi mở page lớn
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markReadIfNeeded = async (notification: Notification) => {
    if (notification.isRead) return;

    await markAsRead(notification.id);
  };

  const openTrackInMainContent = async (mediaItemID: number) => {
    const res = await mediaApi.getById(String(mediaItemID));
    const dto = res.data?.data ?? res.data;
    const track = mapMediaItemDtoToMedia(dto);

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

  const handleOpenNotification = async (
    notification: Notification,
  ) => {
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
      return;
    }

    if (isSharePlaylist && data.playlistID) {
      navigate(`/playlist/${data.playlistID}`);
      return;
    }

    if (notification.type === "follow") {
      return;
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }

    return (
      new Date(b.noticedAt).getTime() -
      new Date(a.noticedAt).getTime()
    );
  });

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: "30px",
        paddingBottom: "120px",
        boxSizing: "border-box",
        background:
          "linear-gradient(180deg, #1f1f1f 0%, #121212 260px)",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1 style={{ color: "#fff", fontSize: "42px", margin: 0 }}>
            Thông báo
          </h1>

          <p style={{ color: "#b3b3b3", marginTop: "8px" }}>
            {unreadCount > 0
              ? `${unreadCount} thông báo chưa đọc`
              : "Bạn đã đọc hết thông báo"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{
              border: "none",
              borderRadius: "999px",
              background: "#fff",
              color: "#000",
              padding: "10px 18px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Đánh dấu đã đọc
          </button>
        )}
      </section>

      {loading && <p style={{ color: "#b3b3b3" }}>Đang tải thông báo...</p>}

      {error && <p style={{ color: "#ff7676" }}>{error}</p>}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 900px)",
            gap: "8px",
            alignItems: "start",
          }}
        >
          {sortedNotifications.length === 0 ? (
            <div
              style={{
                minHeight: "360px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                color: "#b3b3b3",
              }}
            >
              <div style={{ fontSize: "54px", marginBottom: "16px" }}>
                🔔
              </div>

              <h2 style={{ color: "#fff" }}>Chưa có thông báo</h2>

              <p>Các thông báo mới sẽ xuất hiện ở đây.</p>
            </div>
          ) : (
            sortedNotifications.map((item) => (
              <NotificationItem
                key={item.id}
                notification={item}
                onOpen={handleOpenNotification}
              />
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default NotificationPage;