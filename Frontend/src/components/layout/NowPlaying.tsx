import { useState } from "react"; // NEW: quản lý trạng thái thu/mở panel
import { usePlayer } from "../../hooks/usePlayer";

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
};

const NowPlaying = () => {
  // NEW: trạng thái thu gọn / mở rộng NowPlaying
  const [isCollapsed, setIsCollapsed] = useState(false);

  // NEW: lấy playTrack để click bài trong queue phát luôn
  const { currentTrack, queue, playTrack } = usePlayer();

  // NEW: các bài sắp phát
  const upcomingTracks = queue.filter((track) => track.id !== currentTrack?.id);

  // NEW: giao diện khi thu gọn
  if (isCollapsed) {
    return (
      <aside
        style={{
          width: "48px",
          height: "100%",
          background: "#121212",
          borderRadius: "12px",

          display: "flex",

          justifyContent: "center", // ngang
          alignItems: "center", // dọc

          boxSizing: "border-box",
          transition: "width 0.25s ease",
        }}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          title="Mở thông tin bài hát"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: "#2a2a2a",
            color: "#fff",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ‹
        </button>
      </aside>
    );
  }

  if (!currentTrack) {
    return (
      <aside
        style={{
          width: "320px",
          flexShrink: 0, // FIX
          height: "100%",
          background: "#121212",
          borderRadius: "12px",
          padding: "20px",
          color: "#b3b3b3",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* NEW: nút thu gọn khi chưa có bài */}
        <button
          onClick={() => setIsCollapsed(true)}
          title="Thu gọn"
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "none",
            background: "#2a2a2a",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ‹
        </button>

        <div style={{ paddingTop: "40px" }}>
          Chưa có bài hát nào đang phát 🎵
        </div>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: "320px",
        minWidth: "320px",
        height: "100%",
        background: "#121212",
        borderRadius: "12px",
        overflowY: "auto", // NEW: nội dung nhiều thì cuộn trong panel
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        transition: "width 0.25s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          color: "#fff",
          fontWeight: 700,
          fontSize: "16px",
          display: "flex", // NEW
          alignItems: "center", // NEW
          gap: "10px", // NEW
        }}
      >
        {/* NEW: nút thu gọn ở góc trái */}
        <button
          onClick={() => setIsCollapsed(true)}
          title="Thu gọn thông tin bài hát"
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "none",
            background: "#2a2a2a",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          ›
        </button>

        <span>Đang phát</span>
      </div>

      {/* Cover */}
      <div style={{ padding: "16px" }}>
        {currentTrack.thumbnailUrl ?
          <img
            src={currentTrack.thumbnailUrl}
            alt={currentTrack.title}
            style={{
              width: "100%",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        : <div
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "12px",
              background: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            🎵
          </div>
        }
      </div>

      {/* Info */}
      <div style={{ padding: "0 16px 16px" }}>
        <h2
          style={{
            color: "#fff",
            marginBottom: "6px",
            fontSize: "22px",
          }}
        >
          {currentTrack.title}
        </h2>

        <p
          style={{
            color: "#b3b3b3",
            marginBottom: "12px",
          }}
        >
          {currentTrack.artist.name}
        </p>

        <div
          style={{
            background: "#181818",
            borderRadius: "10px",
            padding: "12px",
          }}
        >
          <p style={{ color: "#fff" }}>
            🎵 Thể loại: {currentTrack.genre ?? "Unknown"}
          </p>

          <p style={{ color: "#fff" }}>
            ⏱ Thời lượng: {formatDuration(currentTrack.duration)}
          </p>

          <p style={{ color: "#fff" }}>📃 Hàng chờ: {queue.length} bài</p>
        </div>

        {/* NEW: Queue Section */}
        <div
          style={{
            marginTop: "16px",
            background: "#181818",
            borderRadius: "10px",
            padding: "12px",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          >
            Tiếp theo
          </h3>

          {upcomingTracks.length === 0 ?
            <p
              style={{
                color: "#b3b3b3",
                fontSize: "13px",
              }}
            >
              Không có bài tiếp theo
            </p>
          : upcomingTracks.slice(0, 5).map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)} // NEW: click bài trong queue để phát
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  padding: "6px",
                }}
              >
                {track.thumbnailUrl ?
                  <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      objectFit: "cover",
                    }}
                  />
                : <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      background: "#2a2a2a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    🎵
                  </div>
                }

                <div style={{ overflow: "hidden" }}>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {track.title}
                  </div>

                  <div
                    style={{
                      color: "#b3b3b3",
                      fontSize: "12px",
                    }}
                  >
                    {track.artist.name}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </aside>
  );
};

export default NowPlaying;
