import { useEffect, useState } from "react";
import { playlistApi } from "../../api/playlistApi";
import type { Playlist } from "../../types/playlist";
import { AddToPlaylistIcon } from "../common/icons";
type Props = {
  mediaId: string | number;
};

type PlaylistApiResponse = {
  success?: boolean;
  succes?: boolean;
  data?: Playlist[];
};

const getPlaylistId = (playlist: Playlist): number => {
  return playlist.id ?? playlist.playlistID ?? 0;
};

const getPlaylistName = (playlist: Playlist): string => {
  return playlist.name ?? playlist.playlistName ?? "Playlist chưa có tên";
};

const getTrackCount = (playlist: Playlist): number => {
  return playlist.trackCount ?? playlist.tracks?.length ?? 0;
};

const AddToPlaylistButton = ({ mediaId }: Props) => {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadPlaylists = async () => {
      try {
        setLoading(true);

        const res = await playlistApi.getMyPlaylists();

        const body = res.data as PlaylistApiResponse | Playlist[];

        const data = Array.isArray(body)
          ? body
          : Array.isArray(body.data)
            ? body.data
            : [];

        setPlaylists(data);
      } catch (error) {
        console.error("LOAD PLAYLISTS ERROR:", error);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeMenu = () => setOpen(false);

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, [open]);

  const showNotice = (message: string) => {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 1600);
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    const songId = Number(mediaId);

    if (!playlistId || !songId) {
      showNotice("Bài hát hoặc playlist không hợp lệ");
      return;
    }

    try {
      await playlistApi.addTrack(playlistId, songId);

      showNotice("Đã thêm vào playlist");
      setOpen(false);
    } catch (error) {
      console.error("ADD TO PLAYLIST ERROR:", error);
      showNotice("Không thêm được bài hát");
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
          border: "1.5px solid #b3b3b3",
          background: open ? "#fff" : "transparent",
          color: open ? "#000" : "#b3b3b3",
          cursor: "pointer",
          fontSize: "21px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AddToPlaylistIcon/>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "40px",
            width: "310px",
            background: "#282828",
            borderRadius: "6px",
            padding: "4px",
            zIndex: 9999,
            boxShadow: "0 16px 40px rgba(0,0,0,.75)",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              padding: "12px",
              borderBottom: "1px solid #3a3a3a",
              marginBottom: "4px",
            }}
          >
            Thêm vào danh sách phát
          </div>

          {loading && (
            <div
              style={{
                color: "#b3b3b3",
                padding: "14px 12px",
                fontSize: "14px",
              }}
            >
              Đang tải playlist...
            </div>
          )}

          {!loading && playlists.length === 0 && (
            <div
              style={{
                color: "#b3b3b3",
                padding: "14px 12px",
                fontSize: "14px",
              }}
            >
              Bạn chưa có playlist nào
            </div>
          )}

          {!loading &&
            playlists.map((playlist) => {
              const playlistId = getPlaylistId(playlist);

              return (
                <button
                  key={playlistId}
                  onClick={() => handleAddToPlaylist(playlistId)}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#3e3e3e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "4px",
                      background:
                        "linear-gradient(135deg, #444, #181818)",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {getPlaylistName(playlist)}
                    </div>

                    <div
                      style={{
                        color: "#b3b3b3",
                        fontSize: "12px",
                        marginTop: "3px",
                      }}
                    >
                      Danh sách phát • {getTrackCount(playlist)} bài
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      )}

      {notice && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "110px",
            transform: "translateX(-50%)",
            background: "#fff",
            color: "#000",
            padding: "11px 18px",
            borderRadius: "999px",
            fontWeight: 800,
            zIndex: 99999,
            boxShadow: "0 12px 30px rgba(0,0,0,.45)",
          }}
        >
          {notice}
        </div>
      )}
    </div>
  );
};

export default AddToPlaylistButton;
