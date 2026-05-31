import { useState } from "react";

const artists = [
  {
    id: 1,
    name: "Minh Huy",
    role: "Nghệ Sĩ Chính",
    emoji: "🎤",
    color: "#2a3a4a",
  },
  {
    id: 2,
    name: "Pinny",
    role: "Nghệ Sĩ Chính",
    emoji: "🎵",
    color: "#3a2a4a",
  },
  {
    id: 3,
    name: "Lê Minh Huy",
    role: "Người Soạn Nhạc",
    emoji: "🎼",
    color: "#2a4a2a",
  },
];

const queue = [
  {
    id: 1,
    title: "Exit Sign",
    artist: "HIEUTHUHAI, marzuz",
    color: "#3d1f1f",
    emoji: "🚪",
  },
  {
    id: 2,
    title: "Có Chắc Yêu Là Đây",
    artist: "Sơn Tùng M-TP",
    color: "#1a3a5c",
    emoji: "💙",
  },
  {
    id: 3,
    title: "Chúng Ta Của Hiện Tại",
    artist: "Sơn Tùng M-TP",
    color: "#2d4a1e",
    emoji: "🌿",
  },
];

const FollowBtn = () => {
  const [following, setFollowing] = useState(false);
  return (
    <button
      onClick={() => setFollowing(!following)}
      style={{
        background: following ? "#1DB954" : "transparent",
        color: following ? "#000" : "#fff",
        border: `1px solid ${following ? "#1DB954" : "#727272"}`,
        borderRadius: "500px",
        padding: "5px 16px",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.15s",
        letterSpacing: "0.02em",
      }}
      onMouseEnter={(e) => {
        if (!following) e.currentTarget.style.borderColor = "#fff";
      }}
      onMouseLeave={(e) => {
        if (!following) e.currentTarget.style.borderColor = "#727272";
      }}
    >
      {following ? "Đang theo dõi" : "Theo dõi"}
    </button>
  );
};

const RightPanel = () => {
  return (
    <aside
      style={{
        width: "300px",
        minWidth: "300px",
        background: "#121212",
        borderLeft: "1px solid #282828",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin" as const,
        scrollbarColor: "#555 transparent",
        boxSizing: "border-box" as const,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 12px",
          borderBottom: "1px solid #282828",
          position: "sticky",
          top: 0,
          background: "linear-gradient(180deg, #1a1a2e 0%, #121212 300px)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Queue icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#b3b3b3">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
          </svg>
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>
            Ngày Rời Chuyến Bay
          </span>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          {/* Share */}
          <button
            style={{
              background: "none",
              border: "none",
              color: "#b3b3b3",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
            title="Chia sẻ"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
          </button>
          {/* Add */}
          <button
            style={{
              background: "none",
              border: "none",
              color: "#b3b3b3",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
            title="Thêm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
          {/* Expand */}
          <button
            style={{
              background: "none",
              border: "none",
              color: "#b3b3b3",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
            title="Mở rộng"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Song title block ── */}
      <div
        style={{
          padding: "16px",
          background: "linear-gradient(180deg, #2a3a4a 0%, #121212 100%)",
        }}
      >
        <div
          style={{
            color: "#b3b3b3",
            fontSize: "11px",
            marginBottom: "4px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Đang phát
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Ngày Rời Chuyến Bay
        </div>
        <div style={{ color: "#b3b3b3", fontSize: "13px", marginTop: "2px" }}>
          Minh Huy, Pinny
        </div>
      </div>

      {/* ── Người tham gia ── */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>
            Người tham gia thực hiện
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#b3b3b3",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
          >
            Hiện tất cả
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {artists.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  minWidth: 0,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${a.color}, ${a.color}88)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  {a.emoji}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {a.name}
                  </div>
                  <div
                    style={{
                      color: "#b3b3b3",
                      fontSize: "11px",
                      marginTop: "1px",
                    }}
                  >
                    {a.role}
                  </div>
                </div>
              </div>
              {a.role === "Nghệ Sĩ Chính" && <FollowBtn />}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#282828", margin: "0 16px" }} />

      {/* ── Tiếp theo trong danh sách ── */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>
            Tiếp theo trong dan...
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#b3b3b3",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
          >
            Mở danh sách chờ
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {queue.map((track) => (
            <QueueItem key={track.id} track={track} />
          ))}
        </div>
      </div>
    </aside>
  );
};

const QueueItem = ({ track }: { track: (typeof queue)[0] }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px 8px",
        borderRadius: "6px",
        background: hovered ? "#2a2a2a" : "transparent",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "4px",
          background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          flexShrink: 0,
        }}
      >
        {track.emoji}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
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
            fontSize: "11px",
            marginTop: "2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {track.artist}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
