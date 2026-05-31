import { useState, useEffect } from "react";
import { usePlayer } from "../../hooks/usePlayer";
import { playerApi } from "../../api/playerApi"; // ← sửa chữ hoa

interface Artist {
  id: number;
  name: string;
  role: string;
  emoji: string;
  color: string;
}

interface QueueTrack {
  id: number;
  title: string;
  artist: string;
  color: string;
  emoji: string;
}

// ← tách Spinner ra ngoài
const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "16px", color: "#b3b3b3", fontSize: "13px", gap: "8px", alignItems: "center" }}>
    <div style={{ width: "14px", height: "14px", border: "2px solid #333", borderTop: "2px solid #1DB954", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    Đang tải...
  </div>
);

const FollowBtn = () => {
  const [following, setFollowing] = useState(false);
  return (
    <button onClick={() => setFollowing(!following)}
      style={{ background: following ? "#1DB954" : "transparent", color: following ? "#000" : "#fff", border: `1px solid ${following ? "#1DB954" : "#727272"}`, borderRadius: "500px", padding: "5px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={(e) => { if (!following) e.currentTarget.style.borderColor = "#fff"; }}
      onMouseLeave={(e) => { if (!following) e.currentTarget.style.borderColor = "#727272"; }}
    >
      {following ? "Đang theo dõi" : "Theo dõi"}
    </button>
  );
};

const QueueItem = ({ track }: { track: QueueTrack }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 8px", borderRadius: "6px", background: hovered ? "#2a2a2a" : "transparent", cursor: "pointer", transition: "background 0.15s" }}
    >
      <div style={{ width: "40px", height: "40px", borderRadius: "4px", background: `linear-gradient(135deg, ${track.color}, ${track.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
        {track.emoji}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.title}</div>
        <div style={{ color: "#b3b3b3", fontSize: "11px", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.artist}</div>
      </div>
    </div>
  );
};

const RightPanel = () => {
  const { currentTrack } = usePlayer();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [queue, setQueue]     = useState<QueueTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [queueRes, artistsRes] = await Promise.all([
          playerApi.getQueue(),
          currentTrack ? playerApi.getArtists(currentTrack.id) : Promise.resolve({ data: [] }),
        ]);
        setQueue(queueRes.data);
        setArtists(artistsRes.data);
      } catch {
        setQueue([]);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentTrack?.id]);

  return (
    <aside style={{ width: "300px", minWidth: "300px", background: "#121212", borderLeft: "1px solid #282828", display: "flex", flexDirection: "column", fontFamily: "'Circular', sans-serif", height: "100%", overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "#555 transparent", boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 12px", borderBottom: "1px solid #282828", position: "sticky", top: 0, background: "linear-gradient(180deg, #1a1a2e 0%, #121212 100%)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#b3b3b3">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
          </svg>
          <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>
            {currentTrack?.title ?? "Chưa phát bài nào"}
          </span>
        </div>
      </div>

      {/* Now Playing */}
      <div style={{ padding: "16px", background: `linear-gradient(180deg, ${currentTrack?.color ?? "#2a3a4a"} 0%, #121212 100%)` }}>
        <div style={{ color: "#b3b3b3", fontSize: "11px", marginBottom: "4px", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>Đang phát</div>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>{currentTrack?.title ?? "—"}</div>
        <div style={{ color: "#b3b3b3", fontSize: "13px", marginTop: "2px" }}>{currentTrack?.artist ?? "—"}</div>
      </div>

      {/* Artists */}
      <div style={{ padding: "16px" }}>
        <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "14px" }}>Người tham gia thực hiện</span>
        {loading ? <Spinner /> : artists.length === 0 ? (
          <div style={{ color: "#b3b3b3", fontSize: "13px" }}>Chưa có dữ liệu</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {artists.map((a) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `linear-gradient(135deg, ${a.color}, ${a.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                    {a.emoji}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                    <div style={{ color: "#b3b3b3", fontSize: "11px", marginTop: "1px" }}>{a.role}</div>
                  </div>
                </div>
                {a.role === "Nghệ Sĩ Chính" && <FollowBtn />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: "1px", background: "#282828", margin: "0 16px" }} />

      {/* Queue */}
      <div style={{ padding: "16px" }}>
        <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "14px" }}>Tiếp theo</span>
        {loading ? <Spinner /> : queue.length === 0 ? (
          <div style={{ color: "#b3b3b3", fontSize: "13px" }}>Hàng chờ trống</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {queue.map((track) => (
              <QueueItem key={track.id} track={track} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;