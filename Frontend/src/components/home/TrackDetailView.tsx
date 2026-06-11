import { useEffect, useState } from "react";
import { playlistApi } from "../../api/playlistApi";
import type { Playlist } from "../../types/playlist";

type Props = {
  mediaId: string | number;
};

const getPlaylistId = (playlist: Playlist) => {
  return playlist.id ?? playlist.playlistID ?? 0;
};

const getPlaylistName = (playlist: Playlist) => {
  return playlist.name ?? playlist.playlistName ?? "Playlist chưa có tên";
};

const AddToPlaylistButton = ({ mediaId }: Props) => {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadPlaylists = async () => {
      try {
        setLoading(true);
        const res = await playlistApi.getMyPlaylists();

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? [];

        setPlaylists(data);
      } catch (err) {
        console.error("LOAD PLAYLISTS ERROR:", err);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [open]);

  const handleAdd = async (playlistId: number) => {
    const id = Number(mediaId);
    if (!playlistId || !id) return;

    try {
      await playlistApi.addTrack(playlistId, id);
      setMessage("Đã thêm vào playlist");
      setTimeout(() => setMessage(""), 1800);
      setOpen(false);
    } catch (err) {
      console.error("ADD TO PLAYLIST ERROR:", err);
      setMessage("Không thêm được bài hát");
      setTimeout(() => setMessage(""), 1800);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        title="Thêm vào playlist"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid #b3b3b3",
          background: "transparent",
          color: "#b3b3b3",
          cursor: "pointer",
          fontSize: "20px",
          lineHeight: 1,
        }}
      >
        +
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "260px",
            background: "#282828",
            borderRadius: "8px",
            padding: "6px",
            zIndex: 999,
            boxShadow: "0 12px 32px rgba(0,0,0,.55)",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              padding: "10px 12px",
              borderBottom: "1px solid #3a3a3a",
              marginBottom: "4px",
            }}
          >
            Thêm vào danh sách phát
          </div>

          {loading && (
            <div style={{ color: "#b3b3b3", padding: "12px" }}>Đang tải...</div>
          )}

          {!loading && playlists.length === 0 && (
            <div style={{ color: "#b3b3b3", padding: "12px" }}>
              Bạn chưa có playlist
            </div>
          )}

          {!loading &&
            playlists.map((playlist) => {
              const playlistId = getPlaylistId(playlist);

              return (
                <button
                  key={playlistId}
                  onClick={() => handleAdd(playlistId)}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    color: "#fff",
                    padding: "12px",
                    textAlign: "left",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3a3a3a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {getPlaylistName(playlist)}
                </button>
              );
            })}
        </div>
      )}

      {message && (
        <div
          style={{
            position: "fixed",
            bottom: "110px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            color: "#000",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 700,
            zIndex: 9999,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddToPlaylistButton;