<<<<<<< HEAD
import { useState } from "react";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import { useFavorite } from "../../hooks/useFavorite";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";

type AlbumDetailViewProps = {
  cover: Media;
  tracks: Media[];
  onOpenTrack: (track: Media) => void;
  onOpenArtist: (artistName: string) => void;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${String(sec).padStart(2, "0")}`;
};

const AlbumDetailView = ({
  cover,
  tracks,
  onOpenTrack,
  onOpenArtist,
}: AlbumDetailViewProps) => {
  const { playTrack, setQueue } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorite();

  const [shuffle, setShuffle] = useState(false);

  const totalDuration = tracks.reduce(
    (sum, item) => sum + (item.duration ?? 0),
    0
  );

  const artistName = cover.artist?.name ?? "Unknown Artist";

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;

    const list = shuffle ? [...tracks].sort(() => Math.random() - 0.5) : tracks;

    setQueue(list);
    playTrack(list[0]);
  };

  return (
    <div>
      <section
        style={{
          display: "flex",
          gap: "26px",
          alignItems: "flex-end",
          padding: "22px 0 34px",
        }}
      >
        <div
          style={{
            width: "230px",
            height: "230px",
            borderRadius: "8px",
            background: "#282828",
            overflow: "hidden",
            boxShadow: "0 18px 50px rgba(0,0,0,.55)",
            flexShrink: 0,
          }}
        >
          {cover.thumbnailUrl ? (
            <img
              src={cover.thumbnailUrl}
              alt={cover.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
                color: "#b3b3b3",
              }}
            >
              ♪
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ color: "#fff", fontWeight: 700 }}>
            {tracks.length > 1 ? "Danh sách phát" : "Đĩa đơn"}
          </p>

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(46px, 6vw, 82px)",
              margin: "8px 0",
              lineHeight: 1,
              wordBreak: "break-word",
            }}
          >
            {cover.title}
          </h1>

          <p style={{ color: "#d6d6d6", fontWeight: 600 }}>
            <span
              onClick={() => onOpenArtist(artistName)}
              style={{ cursor: "pointer", color: "#fff" }}
            >
              {artistName}
            </span>{" "}
            • {new Date().getFullYear()} • {tracks.length} bài hát •{" "}
            {formatDuration(totalDuration)}
          </p>
        </div>
      </section>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={handlePlayAlbum}
          title="Phát"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: "#1DB954",
            color: "#000",
            cursor: "pointer",
            fontSize: "24px",
            fontWeight: 900,
          }}
        >
          ▶
        </button>

        <button
          onClick={() => setShuffle(!shuffle)}
          title="Phát ngẫu nhiên"
          style={{
            background: "none",
            border: "none",
            color: shuffle ? "#1DB954" : "#b3b3b3",
            fontSize: "28px",
            cursor: "pointer",
          }}
        >
          ⇄
        </button>

        <AddToPlaylistButton mediaId={cover.id} />

        <button
          title="Tùy chọn khác"
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          ⋯
        </button>
      </section>

      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px minmax(0, 1.5fr) 48px minmax(140px,.7fr) 90px",
            color: "#b3b3b3",
            fontSize: "13px",
            borderBottom: "1px solid #333",
            padding: "0 8px 10px",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div>#</div>
          <div>Tiêu đề</div>
          <div></div>
          <div>Nghệ sĩ</div>
          <div style={{ textAlign: "right" }}>⏱</div>
        </div>

        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            index={index}
            track={track}
            tracks={tracks}
            liked={isFavorite(track.id)}
            onOpenTrack={onOpenTrack}
            onOpenArtist={onOpenArtist}
            onToggleFavorite={() => toggleFavorite(track.id)}
          />
        ))}
      </section>
    </div>
  );
};

const TrackRow = ({
  index,
  track,
  tracks,
  liked,
  onOpenTrack,
  onOpenArtist,
  onToggleFavorite,
}: {
  index: number;
  track: Media;
  tracks: Media[];
  liked: boolean;
  onOpenTrack: (track: Media) => void;
  onOpenArtist: (artistName: string) => void;
  onToggleFavorite: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const { playTrack, setQueue } = usePlayer();

  const artistName = track.artist?.name ?? "Unknown Artist";

  return (
    <div
      onClick={() => onOpenTrack(track)}
      onDoubleClick={() => {
        setQueue(tracks);
        playTrack(track);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns:
          "40px minmax(0, 1.5fr) 48px minmax(140px,.7fr) 90px",
        alignItems: "center",
        minHeight: "64px",
        padding: "0 8px",
        borderRadius: "8px",
        cursor: "pointer",
        gap: "12px",
        background: hovered ? "#1a1a1a" : "transparent",
      }}
    >
      <div style={{ color: "#b3b3b3" }}>
        {hovered ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQueue(tracks);
              playTrack(track);
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ▶
          </button>
        ) : (
          index + 1
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "6px",
            background: "#282828",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {track.thumbnailUrl ? (
            <img
              src={track.thumbnailUrl}
              alt={track.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                color: "#b3b3b3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ♪
            </div>
          )}
        </div>

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
            {track.title}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenArtist(artistName);
            }}
            style={{
              color: "#b3b3b3",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            {artistName}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {hovered && <AddToPlaylistButton mediaId={track.id} />}
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          onOpenArtist(artistName);
        }}
        style={{
          color: "#b3b3b3",
          fontSize: "14px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {artistName}
      </div>

      <div
        style={{
          color: "#b3b3b3",
          fontSize: "14px",
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            style={{
              border: "none",
              background: "transparent",
              color: liked ? "#1DB954" : "#b3b3b3",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            {liked ? "♥" : "♡"}
          </button>
        )}

        {formatDuration(track.duration)}
      </div>
=======
import { useEffect, useState } from "react";
import { playlistApi } from "../../api/playlistApi";
import type { Playlist } from "../../types/playlist";

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
        +
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
>>>>>>> origin/vinh-branch
    </div>
  );
};

<<<<<<< HEAD
export default AlbumDetailView;
=======
export default AddToPlaylistButton;
>>>>>>> origin/vinh-branch
