import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import NotificationItem from "../../components/notification/NotificationItem";
import { useNotification } from "../../hooks/useNotification";
import { mediaApi } from "../../api/mediaApi";
import { playerStore } from "../../store/playerStore";
import type { Media } from "../../types/media";
import { mapMediaItemDtoToMedia } from "../../types/media";

const NotificationPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  const [searchParams] = useSearchParams();

  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({});
  const [selectedSong, setSelectedSong] = useState<Media | null>(null);
  const [songLoading, setSongLoading] = useState(false);
  const [songError, setSongError] = useState<string | null>(null);
  const [showSongPanel, setShowSongPanel] = useState(false);

  const playTrack = playerStore((state) => state.playTrack);

  useEffect(() => {
    const mediaId = searchParams.get("mediaId");

    if (!mediaId) return;

    const loadSong = async () => {
      try {
        setSongLoading(true);
        setSongError(null);
        setShowSongPanel(true);

        const res = await mediaApi.getById(mediaId);
        const dto = res.data?.data ?? res.data;
        const media = mapMediaItemDtoToMedia(dto);

        setSelectedSong(media);
        setMediaMap((prev) => ({
          ...prev,
          [String(media.id)]: media,
        }));
      } catch (err) {
        console.error("LOAD SONG FROM NOTIFICATION ERROR:", err);
        setSelectedSong(null);
        setSongError("Không tải được bài hát này.");
        setShowSongPanel(true);
      } finally {
        setSongLoading(false);
      }
    };

    loadSong();
  }, [searchParams]);

  useEffect(() => {
    const loadMediaNames = async () => {
      const ids = notifications
        .map((n) => {
          try {
            const data = JSON.parse(n.payload);
            return data?.mediaItemID ? String(data.mediaItemID) : null;
          } catch {
            return null;
          }
        })
        .filter((id): id is string => Boolean(id));

      const uniqueIds = [...new Set(ids)];

      for (const id of uniqueIds) {
        if (mediaMap[id]) continue;

        try {
          const res = await mediaApi.getById(id);
          const dto = res.data?.data ?? res.data;
          const media = mapMediaItemDtoToMedia(dto);

          setMediaMap((prev) => ({
            ...prev,
            [id]: media,
          }));
        } catch (error) {
          console.error("LOAD MEDIA NAME ERROR:", error);
        }
      }
    };

    loadMediaNames();
  }, [notifications, mediaMap]);

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
            onClick={markAllAsRead}
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
          {notifications.length === 0 ? (
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
            notifications.map((item) => (
              <NotificationItem
                key={item.id}
                notification={item}
                onRead={markAsRead}
                mediaMap={mediaMap}
              />
            ))
          )}
        </div>
      )}

      {showSongPanel && (selectedSong || songLoading || songError) && (
        <div
          onClick={() => setShowSongPanel(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.72)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "420px",
              maxWidth: "100%",
              background: "#181818",
              borderRadius: "18px",
              padding: "22px",
              border: "1px solid #2a2a2a",
              boxShadow: "0 20px 60px rgba(0,0,0,.7)",
              position: "relative",
              color: "#fff",
            }}
          >
            <button
              onClick={() => setShowSongPanel(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                background: "#2a2a2a",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 800,
                zIndex: 2,
              }}
            >
              ×
            </button>

            {songLoading && (
              <p style={{ color: "#b3b3b3" }}>Đang tải bài hát...</p>
            )}

            {songError && !songLoading && (
              <p style={{ color: "#ff7676" }}>{songError}</p>
            )}

            {!songLoading && selectedSong && (
              <>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "14px",
                    background: "#282828",
                    overflow: "hidden",
                    marginBottom: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#b3b3b3",
                    fontSize: "48px",
                  }}
                >
                  {selectedSong.thumbnailUrl ? (
                    <img
                      src={selectedSong.thumbnailUrl}
                      alt={selectedSong.title}
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

                <p
                  style={{
                    color: "#b3b3b3",
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}
                >
                  Bài hát được chia sẻ
                </p>

                <h2
                  style={{
                    color: "#fff",
                    fontSize: "28px",
                    margin: "0 0 8px",
                    lineHeight: 1.15,
                  }}
                >
                  {selectedSong.title}
                </h2>

                <p
                  style={{
                    color: "#b3b3b3",
                    fontSize: "15px",
                    margin: 0,
                  }}
                >
                  {selectedSong.artist?.name ?? "Không rõ nghệ sĩ"}
                </p>

                <button
                  onClick={() => {
                    playTrack(selectedSong);
                    setShowSongPanel(false);
                  }}
                  style={{
                    marginTop: "22px",
                    width: "100%",
                    height: "50px",
                    border: "none",
                    borderRadius: "999px",
                    background: "#1DB954",
                    color: "#000",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                >
                  ▶ Phát bài hát
                </button>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
};

export default NotificationPage;