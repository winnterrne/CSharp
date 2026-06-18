import { useEffect, useState, type ReactNode } from "react";
import type { Media } from "../../types/media";
import type { Playlist } from "../../types/playlist";
import { playlistApi } from "../../api/playlistApi";
import { useFavorite } from "../../hooks/useFavorite";
import { usePlayer } from "../../hooks/usePlayer";
import {
  AddToPlaylistIcon,
  HeartIcon,
  AddToQueueIcon,
  RemoveIcon,
  RadioIcon,
  ArtistIcon,
  AlbumIcon,
  CreditsIcon,
  DownloadIcon,
  ShareIcon,
  OpenAppIcon,
} from "../common/icons";

type TrackActionMenuProps = {
  track: Media;
  open: boolean;
  onClose: () => void;
  onOpenArtist?: (artistID: number, artistName: string,artistImage: string) => void;
};

type PlaylistResponse = {
  success?: boolean;
  succes?: boolean;
  data?: Playlist[];
};

const getPlaylistId = (playlist: Playlist): number =>
  playlist.id ?? playlist.playlistID ?? 0;

const getPlaylistName = (playlist: Playlist): string =>
  playlist.name ?? playlist.playlistName ?? "Playlist chưa có tên";

const getTrackCount = (playlist: Playlist): number =>
  playlist.trackCount ?? playlist.tracks?.length ?? 0;

const TrackActionMenu = ({
  track,
  open,
  onClose,
  onOpenArtist,
}: TrackActionMenuProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [notice, setNotice] = useState("");

  const { addToQueue } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorite();

  const liked = isFavorite(track.id);
  const artistID = track.artist?.id;
  const artistName = track.artist?.name ?? "Unknown Artist";
  const artistImage = track.artist?.avatarUrl ?? " ";

  const showNotice = (message: string) => {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 1600);
  };

  useEffect(() => {
    if (!open) return;

    const loadPlaylists = async () => {
      try {
        const res = await playlistApi.getMyPlaylists();

        const body = res.data as PlaylistResponse | Playlist[];

        const data = Array.isArray(body)
          ? body
          : Array.isArray(body.data)
            ? body.data
            : [];

        setPlaylists(data);
      } catch (error) {
        console.error("LOAD PLAYLISTS ERROR:", error);
        setPlaylists([]);
      }
    };

    loadPlaylists();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClose = () => onClose();

    window.addEventListener("click", handleClose);

    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleAddToPlaylist = async (playlistId: number) => {
    const mediaId = Number(track.id);

    if (!playlistId || !mediaId) {
      showNotice("Bài hát hoặc playlist không hợp lệ");
      return;
    }

    try {
      await playlistApi.addTrack(playlistId, mediaId);

      showNotice("Đã thêm vào playlist");
      onClose();
    } catch (error) {
      console.error("ADD TO PLAYLIST ERROR:", error);
      showNotice("Không thêm được bài hát");
    }
  };

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => showNotice("Đã sao chép liên kết"))
      .catch((error: unknown) => {
        console.error("COPY LINK ERROR:", error);
        showNotice("Không sao chép được liên kết");
      });

    onClose();
  };

  const handleDownload = () => {
    if (!track.url) {
      showNotice("Bài hát chưa có file");
      return;
    }

    const link = document.createElement("a");
    link.href = track.url;
    link.download = `${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          right: 0,
          top: "36px",
          width: "340px",
          background: "#282828",
          borderRadius: "4px",
          padding: "4px",
          boxShadow: "0 16px 40px rgba(0,0,0,.75)",
          zIndex: 9999,
        }}
      >
        <MenuItem
          icon= {<AddToPlaylistIcon/>}
          label="Thêm vào danh sách phát"
          arrow
          onMouseEnter={() => setShowPlaylistMenu(true)}
        />

        <MenuItem
          icon={<HeartIcon filled={liked} />}
          label={
            liked
              ? "Xóa khỏi Bài hát đã thích của bạn"
              : "Lưu vào Bài hát đã thích của bạn"
          }
          onClick={() => {
            toggleFavorite(track.id);
            onClose();
          }}
        />

        <MenuItem
          icon={<AddToQueueIcon />}
          label="Thêm vào danh sách chờ"
          onClick={() => {
            addToQueue(track);
            showNotice("Đã thêm vào hàng chờ");
            onClose();
          }}
        />

        <MenuItem icon={<RemoveIcon />} label="Loại bỏ khỏi hồ sơ sở thích của bạn" />

        <Divider />

        <MenuItem icon={<RadioIcon />} label="Chuyển đến radio theo bài hát" />

        <MenuItem
          icon={<ArtistIcon />}
          label="Chuyển tới nghệ sĩ"
          arrow
          onClick={() => {
            if (!artistID) return;

            onOpenArtist?.(artistID, artistName,artistImage);
            onClose();
          }}
        />

        <MenuItem icon={<AlbumIcon />} label="Chuyển đến album" />

        <MenuItem icon={<CreditsIcon />} label="Xem thông tin ghi công" />

        <MenuItem icon={<DownloadIcon />} label="Tải xuống" onClick={handleDownload} />

        <MenuItem icon={<ShareIcon />} label="Chia sẻ" arrow onClick={handleShare} />

        <Divider />

        <MenuItem icon={<OpenAppIcon />} label="Mở trong ứng dụng dành cho máy tính" />

        {showPlaylistMenu && (
          <div
            onMouseLeave={() => setShowPlaylistMenu(false)}
            style={{
              position: "absolute",
              right: "100%",
              top: 0,
              width: "300px",
              background: "#282828",
              borderRadius: "4px",
              padding: "4px",
              boxShadow: "0 16px 40px rgba(0,0,0,.75)",
            }}
          >
            {playlists.length === 0 ? (
              <MenuItem icon="♪" label="Bạn chưa có playlist" />
            ) : (
              playlists.map((playlist) => {
                const playlistId = getPlaylistId(playlist);

                return (
                  <MenuItem
                    key={playlistId}
                    icon="♪"
                    label={`${getPlaylistName(playlist)} • ${getTrackCount(
                      playlist
                    )} bài`}
                    onClick={() => handleAddToPlaylist(playlistId)}
                  />
                );
              })
            )}
          </div>
        )}
      </div>

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
    </>
  );
};

const MenuItem = ({
  icon,
  label,
  arrow,
  onClick,
  onMouseEnter,
}: {
  icon: ReactNode;
  label: string;
  arrow?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) => (
  <button
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    style={{
      width: "100%",
      minHeight: "44px",
      border: "none",
      background: "transparent",
      color: "#fff",
      display: "grid",
      gridTemplateColumns: "34px 1fr 20px",
      alignItems: "center",
      gap: "8px",
      padding: "0 10px",
      borderRadius: "2px",
      cursor: "pointer",
      textAlign: "left",
      fontSize: "14px",
      fontWeight: 700,
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.background = "#3e3e3e";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.background = "transparent";
    }}
  >
    <span style={{ color: "#b3b3b3", fontSize: "18px" }}>{icon}</span>

    <span
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {label}
    </span>

    <span style={{ color: "#b3b3b3" }}>{arrow ? "›" : ""}</span>
  </button>
);

const Divider = () => (
  <div
    style={{
      height: "1px",
      background: "#3a3a3a",
      margin: "4px 0",
    }}
  />
);

export default TrackActionMenu;