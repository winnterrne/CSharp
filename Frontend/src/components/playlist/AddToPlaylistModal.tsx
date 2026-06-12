import { useEffect, useState } from "react";
import { playlistApi } from "../../api/playlistApi";
import type { Playlist } from "../../types/playlist";
import type { Media } from "../../types/media";

interface AddToPlaylistModalProps {
  open: boolean;
  media: Media | null;
  onClose: () => void;
}

const AddToPlaylistModal = ({
  open,
  media,
  onClose,
}: AddToPlaylistModalProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadPlaylists = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await playlistApi.getMyPlaylists();
        const data: Playlist[] = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? [];

        setPlaylists(data);
      } catch (err) {
        console.error("LOAD PLAYLISTS ERROR:", err);
        setError("Không tải được playlist");
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [open]);

  if (!open || !media) return null;

  const handleAdd = async (playlistId: number) => {
    try {
      setAddingId(playlistId);
      setError("");

      // BE nhận mediaItemId là int
      await playlistApi.addTrack(playlistId, Number(media.id));

      onClose();
    } catch (err) {
      console.error("ADD TRACK TO PLAYLIST ERROR:", err);
      setError("Không thể thêm bài hát vào playlist");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          maxHeight: "70vh",
          background: "#282828",
          borderRadius: "14px",
          padding: "20px",
          boxShadow: "0 20px 70px rgba(0,0,0,.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ color: "#fff", margin: 0 }}>
            Thêm vào playlist
          </h2>

          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "none",
              background: "#3a3a3a",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "16px",
            padding: "10px",
            background: "#181818",
            borderRadius: "8px",
          }}
        >
          <img
            src={media.thumbnailUrl}
            alt={media.title}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "6px",
              objectFit: "cover",
              background: "#333",
            }}
          />

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {media.title}
            </div>

            <div style={{ color: "#b3b3b3", fontSize: "13px" }}>
              {media.artist.name}
            </div>
          </div>
        </div>

        {error && (
          <p style={{ color: "#ff4d4f", fontSize: "13px" }}>
            {error}
          </p>
        )}

        <div
          style={{
            maxHeight: "360px",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <p style={{ color: "#b3b3b3" }}>Đang tải playlist...</p>
          ) : playlists.length === 0 ? (
            <p style={{ color: "#b3b3b3" }}>Bạn chưa có playlist nào</p>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handleAdd(playlist.id)}
                disabled={addingId === playlist.id}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  background: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#3a3a3a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "6px",
                    background: "#3a3a3a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {playlist.coverUrl ? (
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
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

                <div>
                  <div style={{ fontWeight: 700 }}>{playlist.name}</div>
                  <div style={{ color: "#b3b3b3", fontSize: "12px" }}>
                    {playlist.trackCount} bài hát
                  </div>
                </div>

                {addingId === playlist.id && (
                  <span style={{ marginLeft: "auto", color: "#b3b3b3" }}>
                    Đang thêm...
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;