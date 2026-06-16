// src/pages/Album/AlbumDetailPage.tsx

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useParams } from "react-router-dom";

import { albumApi } from "../../api/albumApi";
import type { Album } from "../../types/album";
import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import {
  MoreHorizIcon,
  NowPlayingIcon,
  PlayIcon,
  ShuffleIcon,
} from "../../components/common/icons";

const formatDuration = (seconds?: number) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${String(sec).padStart(2, "0")}`;
};

const getMediaId = (media?: Media | null) => {
  if (!media) return 0;

  const m = media as any;

  return m.id ?? m.mediaItemID ?? m.mediaItemId ?? 0;
};

const getArtistId = (media: Media) => {
  const m = media as any;

  return (
    m.artistID ??
    m.artistId ??
    m.artist?.id ??
    m.artist?.artistID ??
    m.artist?.artistId ??
    0
  );
};

const getArtistName = (media: Media) => {
  const m = media as any;

  return (
    m.artist?.name ??
    m.artist?.artistName ??
    m.artistName ??
    m.ArtistName ??
    "Unknown Artist"
  );
};

const getAlbumArtistName = (album?: Album | null) => {
  if (!album) return "Unknown Artist";

  const a = album as any;

  return (
    a.artistName ??
    a.artist?.name ??
    a.artist?.artistName ??
    "Unknown Artist"
  );
};

const getAlbumImageUrl = (album?: Album | null) => {
  if (!album) return "";

  const a = album as any;

  const image =
    a.albumItemImage ??
    a.albumImage ??
    a.imageUrl ??
    a.coverUrl ??
    "";

  if (!image) return "";

  if (String(image).startsWith("http")) return image;

  return `http://localhost:5081/media/images/album/${image}`;
};

const getTrackImageUrl = (track: Media) => {
  const t = track as any;

  const image =
    t.thumbnailUrl ??
    t.mediaItemImage ??
    t.imageUrl ??
    t.coverUrl ??
    "";

  if (!image) return "";

  if (String(image).startsWith("http")) return image;

  if (String(image).startsWith("/")) {
    return `http://localhost:5081${image}`;
  }

  return `http://localhost:5081/media/images/${image}`;
};

const API_URL = "http://localhost:5081";

const getValue = (item: any, keys: string[]) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") {
      return item[key];
    }
  }

  return undefined;
};

const buildMediaImageUrl = (image?: string) => {
  if (!image) return "";

  if (image.startsWith("http")) return image;

  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/media/images/media/${image}`;
};

const buildStreamUrl = (mediaId: number | string) => {
  return `${API_URL}/api/media/${mediaId}/stream`;
};

const mapAlbumTrackToMedia = (
  item: any,
  fallbackArtistName = "Unknown Artist"
): Media => {
  const media =
    item.media ??
    item.Media ??
    item.mediaItem ??
    item.MediaItem ??
    item;

  const artist =
    media.artist ??
    media.Artist ??
    item.artist ??
    item.Artist ??
    {};

  const id =
    getValue(media, [
      "id",
      "ID",
      "mediaItemID",
      "mediaItemId",
      "MediaItemID",
      "MediaItemId",
    ]) ??
    getValue(item, [
      "id",
      "ID",
      "mediaItemID",
      "mediaItemId",
      "MediaItemID",
      "MediaItemId",
    ]) ??
    0;

  const title =
    getValue(media, [
      "title",
      "Title",
      "titleName",
      "mediaItemName",
      "MediaItemName",
      "mediaName",
      "MediaName",
    ]) ??
    getValue(item, [
      "title",
      "Title",
      "titleName",
      "mediaItemName",
      "MediaItemName",
    ]) ??
    "Không có tên";

  const image =
    getValue(media, [
      "thumbnailUrl",
      "ThumbnailUrl",
      "mediaItemImage",
      "MediaItemImage",
      "imageUrl",
      "ImageUrl",
      "coverUrl",
      "CoverUrl",
    ]) ??
    getValue(item, [
      "thumbnailUrl",
      "ThumbnailUrl",
      "mediaItemImage",
      "MediaItemImage",
      "imageUrl",
      "ImageUrl",
      "coverUrl",
      "CoverUrl",
    ]) ??
    "";

  const artistId =
    getValue(media, [
      "artistID",
      "artistId",
      "ArtistID",
      "ArtistId",
    ]) ??
    getValue(item, [
      "artistID",
      "artistId",
      "ArtistID",
      "ArtistId",
    ]) ??
    getValue(artist, [
      "id",
      "ID",
      "artistID",
      "artistId",
      "ArtistID",
      "ArtistId",
    ]) ??
    0;

  const artistName =
    getValue(media, [
      "artistName",
      "ArtistName",
      "nameArtist",
      "NameArtist",
    ]) ??
    getValue(item, [
      "artistName",
      "ArtistName",
      "nameArtist",
      "NameArtist",
    ]) ??
    getValue(artist, [
      "name",
      "Name",
      "artistName",
      "ArtistName",
    ]) ??
    fallbackArtistName;

  const duration =
    Number(
      getValue(media, [
        "duration",
        "Duration",
        "mediaDuration",
        "MediaDuration",
      ]) ??
        getValue(item, [
          "duration",
          "Duration",
          "mediaDuration",
          "MediaDuration",
        ]) ??
        0
    );

  const type =
    getValue(media, [
      "type",
      "Type",
      "mediaItemType",
      "MediaItemType",
    ]) ??
    getValue(item, [
      "type",
      "Type",
      "mediaItemType",
      "MediaItemType",
    ]) ??
    "audio";

  const thumbnailUrl = image ? buildMediaImageUrl(String(image)) : "";

 const genre =
  getValue(media, [
    "genre",
    "Genre",
    "genreName",
    "GenreName",
    "mediaGenre",
    "MediaGenre",
    "mediaItemTag",
    "MediaItemTag",
    "tag",
    "Tag",
    "category",
    "Category",
    "categoryName",
    "CategoryName",
  ]) ??
  getValue(item, [
    "genre",
    "Genre",
    "genreName",
    "GenreName",
    "mediaGenre",
    "MediaGenre",
    "mediaItemTag",
    "MediaItemTag",
    "tag",
    "Tag",
    "category",
    "Category",
    "categoryName",
    "CategoryName",
  ]) ??
  "Unknown";

  return {
    id,
    title,
    url: buildStreamUrl(id),
    thumbnailUrl,
    duration,
    genre,
    type,
    artist: {
      id: artistId,
      name: artistName,
    },
  } as Media;
};

const mapAlbum = (item: any, albumId: number): Album => {
  return {
    albumID: item.albumID ?? item.albumId ?? item.id ?? albumId,
    albumName:
      item.albumName ??
      item.name ??
      item.title ??
      "Album chưa có tên",
    albumItemImage:
      item.albumItemImage ??
      item.albumImage ??
      item.imageUrl ??
      item.coverUrl ??
      "",
    artistID: item.artistID ?? item.artistId ?? item.artist?.id ?? 0,
    artistName:
      item.artistName ??
      item.artist?.name ??
      item.artist?.artistName ??
      "Unknown Artist",
    uploadAt: item.uploadAt ?? item.uploadAT ?? item.createdAt ?? "",
  } as Album;
};

const AlbumDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { playTrack, pause, play, setQueue, currentTrack, isPlaying } =
    usePlayer();

  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const albumImageUrl = getAlbumImageUrl(album);

  const currentTrackId = useMemo(() => {
    return Number(getMediaId(currentTrack));
  }, [currentTrack]);

  const isCurrentAlbumPlaying = useMemo(() => {
    if (!currentTrack) return false;

    return tracks.some(
      (track) => Number(getMediaId(track)) === Number(getMediaId(currentTrack))
    );
  }, [currentTrack, tracks]);

  const totalDuration = useMemo(() => {
    const totalSeconds = tracks.reduce(
      (sum, track) => sum + (track.duration ?? 0),
      0
    );

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) return `${hours} giờ ${mins} phút`;

    return `${mins} phút`;
  }, [tracks]);

  const loadAlbum = async () => {
    if (!id) {
      setLoading(false);
      setError("Thiếu id album");
      return;
    }

    const albumId = Number(id);

    try {
      setLoading(true);
      setError("");

      const albumRes = await albumApi.getAll();

      const allAlbums =
        Array.isArray(albumRes.data?.data)
          ? albumRes.data.data
          : Array.isArray(albumRes.data)
            ? albumRes.data
            : [];

      const foundAlbum =
        allAlbums.find(
          (item: any) =>
            Number(item.albumID ?? item.albumId ?? item.id) === albumId
        ) ?? null;

      if (!foundAlbum) {
        setError("Không tìm thấy album");
        setAlbum(null);
        setTracks([]);
        return;
      }

        const mappedAlbum = mapAlbum(foundAlbum, albumId);
        setAlbum(mappedAlbum);

        const trackRes = await albumApi.getTracks(albumId);

      console.log("ALBUM TRACKS RAW:", trackRes.data);

      const rawTracks =
        Array.isArray(trackRes.data?.data)
          ? trackRes.data.data
          : Array.isArray(trackRes.data)
            ? trackRes.data
            : [];

        const mappedTracks = rawTracks.map((item: any) =>
             mapAlbumTrackToMedia(item, mappedAlbum.artistName ?? "Unknown Artist")
        );
        console.log("ALBUM TRACKS MAPPED:", mappedTracks);
      setTracks(mappedTracks);
    } catch (err) {
      console.error("LOAD ALBUM DETAIL ERROR:", err);
      setError("Không tải được album");
      setAlbum(null);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbum();
  }, [id]);

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;

    // Nếu bài đang phát không thuộc album hiện tại
    // thì set queue bằng toàn bộ bài trong album và phát bài đầu tiên.
    if (!isCurrentAlbumPlaying) {
      setQueue(tracks);
      playTrack(tracks[0]);
      return;
    }

    // Nếu đang ở đúng album này thì nút play đóng vai trò play/pause.
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handlePlayTrack = (track: Media) => {
    setQueue(tracks);
    playTrack(track);
  };

  const handleToggleTrack = (track: Media) => {
    const isThisTrackPlaying =
      Number(getMediaId(track)) === Number(getMediaId(currentTrack));

    setQueue(tracks);

    if (isThisTrackPlaying) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }

      return;
    }

    playTrack(track);
  };

  const handleOpenArtist = (artistId?: number | string) => {
    console.log("OPEN ARTIST:", artistId);
  };

  if (loading) {
    return <StatusPage text="Đang tải album..." />;
  }

  if (error || !album) {
    return <StatusPage text={error || "Không tìm thấy album"} danger />;
  }

  return (
    <main
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#121212",
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          display: "flex",
          gap: "24px",
          padding: "32px",
          alignItems: "flex-end",
          background:
            "linear-gradient(180deg, rgba(75, 95, 155, .95) 0%, #121212 100%)",
        }}
      >
        <div
          style={{
            width: "220px",
            height: "220px",
            background: "#282828",
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b3b3b3",
            fontSize: "72px",
            boxShadow: "0 16px 40px rgba(0,0,0,.45)",
          }}
        >
          {albumImageUrl ? (
            <img
              src={albumImageUrl}
              alt={album.albumName ?? "Album"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            "💿"
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Album
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(34px, 5vw, 72px)",
              lineHeight: 1,
              margin: "0 0 14px",
              wordBreak: "break-word",
            }}
          >
            {album.albumName ?? "Album chưa có tên"}
          </h1>

          <div
            style={{
              color: "#d7d7d7",
              fontSize: "14px",
            }}
          >
            <strong style={{ color: "#fff" }}>
              {getAlbumArtistName(album)}
            </strong>{" "}
            • {tracks.length} bài hát • {totalDuration}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <button
          onClick={handlePlayAlbum}
          disabled={tracks.length === 0}
          title="Phát album"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: tracks.length === 0 ? "#3a3a3a" : "#1DB954",
            color: "#000",
            cursor: tracks.length === 0 ? "not-allowed" : "pointer",
            fontSize: "22px",
            fontWeight: 900,
            boxShadow: "0 8px 24px rgba(0,0,0,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isCurrentAlbumPlaying && isPlaying ? (
            <NowPlayingIcon />
          ) : (
            <PlayIcon />
          )}
        </button>

        <button
          title="Phát ngẫu nhiên"
          style={{
            border: "none",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "30px",
          }}
        >
          <ShuffleIcon />
        </button>

        <button
          title="Tùy chọn album"
          style={{
            border: "none",
            background: "transparent",
            color: "#b3b3b3",
            cursor: "pointer",
            fontSize: "30px",
          }}
        >
          <MoreHorizIcon />
        </button>
      </section>

      <section style={{ padding: "0 32px 32px" }}>
        {tracks.length === 0 ? (
          <EmptyAlbum />
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "40px minmax(0, 1.7fr) minmax(120px, 1fr) 110px",
                gap: "12px",
                color: "#b3b3b3",
                fontSize: "13px",
                borderBottom: "1px solid #333",
                padding: "0 8px 10px",
                alignItems: "center",
              }}
            >
              <div>#</div>
              <div>Tiêu đề</div>
              <div>Nghệ sĩ</div>
              <div style={{ textAlign: "right" }}>Thời lượng</div>
            </div>

            {tracks.map((track, index) => {
              const active =
                Number(getMediaId(track)) === Number(currentTrackId);

              return (
                <AlbumTrackRow
                  key={getMediaId(track) || index}
                  track={track}
                  index={index}
                  active={active}
                  isPlaying={isPlaying}
                  onPlay={() => handlePlayTrack(track)}
                  onToggle={(e) => {
                    e.stopPropagation();
                    handleToggleTrack(track);
                  }}
                  onOpenArtist={() => handleOpenArtist(getArtistId(track))}
                />
              );
            })}
          </>
        )}
      </section>
    </main>
  );
};

const AlbumTrackRow = ({
  track,
  index,
  active,
  isPlaying,
  onPlay,
  onToggle,
  onOpenArtist,
}: {
  track: Media;
  index: number;
  active: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onToggle: (e: MouseEvent<HTMLButtonElement>) => void;
  onOpenArtist: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  const imageUrl = getTrackImageUrl(track);
  const artistName = getArtistName(track);

  return (
    <div
      onDoubleClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns:
          "40px minmax(0, 1.7fr) minmax(120px, 1fr) 110px",
        gap: "12px",
        alignItems: "center",
        height: "64px",
        padding: "0 8px",
        borderRadius: "8px",
        background:
          hovered ? "#2a2a2a"
          : active ? "rgba(29,185,84,.12)"
          : "transparent",
        cursor: "pointer",
      }}
    >
      <div style={{ color: active ? "#1DB954" : "#b3b3b3", fontSize: "14px" }}>
        {hovered || active ? (
          <button
            onClick={onToggle}
            style={{
              border: "none",
              background: "transparent",
              color: active ? "#1DB954" : "#fff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {active && isPlaying ? <NowPlayingIcon /> : <PlayIcon />}
          </button>
        ) : (
          index + 1
        )}
      </div>

      <div
        onClick={onPlay}
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
            color: "#b3b3b3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={track.title ?? "Media"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            "♪"
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: active ? "#1DB954" : "#fff",
              fontSize: "14px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.title ?? "Không có tên"}
          </div>

          <div
            style={{
              color: "#d0d0d0",
              fontSize: "12px",
              marginTop: "3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {artistName}
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenArtist();
        }}
        style={{
          border: "none",
          background: "transparent",
          color: "#b3b3b3",
          fontSize: "14px",
          textAlign: "left",
          cursor: "pointer",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {artistName}
      </button>

      <div
        style={{
          color: "#b3b3b3",
          fontSize: "14px",
          textAlign: "right",
        }}
      >
        {formatDuration(track.duration)}
      </div>
    </div>
  );
};

const EmptyAlbum = () => (
  <div
    style={{
      textAlign: "center",
      padding: "80px 20px",
      color: "#b3b3b3",
    }}
  >
    <div style={{ fontSize: "72px", marginBottom: "20px" }}>💿</div>
    <h2 style={{ color: "#fff" }}>Album trống</h2>
    <p>Album này chưa có bài hát.</p>
  </div>
);

const StatusPage = ({ text, danger }: { text: string; danger?: boolean }) => (
  <main
    style={{
      height: "100%",
      background: "#121212",
      color: danger ? "#ff4d4f" : "#fff",
      padding: "24px",
      boxSizing: "border-box",
    }}
  >
    {text}
  </main>
);

export default AlbumDetailPage;