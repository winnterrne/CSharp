import QuickPlayCard from "./QuickPlayCard";
import AlbumCardLarge from "./AlbumCardLarge";
import SectionHeader from "./SectionHeader";
import { useHistoryStore } from "../../store/historyStore";
import type { Album } from "../../types/album";
import { albumApi } from "../../api/albumApi";
import { mapAlbumTrackToMedia, type Media } from "../../types/media";


type HomeViewProps = {
  loading: boolean;
  recommended: Media[];
  forYou: Media[];
  upcoming: Media[];
  albums: Album[];
  onOpenTrack: (track: Media) => void;
  onOpenAlbum: (track: Media, tracks: Media[], title?: string) => void;
  onShowAll: (mode: "recommended" | "upcoming" | "forYou") => void;
};

const HomeView = ({
  loading,
  recommended,
  forYou,
  upcoming,
  albums,
  onOpenTrack,
  onOpenAlbum,
  onShowAll,
}: HomeViewProps) => {
  const recentTracks = useHistoryStore((state) => state.recentTracks);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  // Thêm handler này vào trong HomeView component
  const handleOpenAlbumById = async (album: Album) => {
    try {
      const res = await albumApi.getTracks(album.albumID);
      const rawTracks = res.data?.data ?? [];

      const tracks: Media[] = rawTracks.map((item) =>
        mapAlbumTrackToMedia(item, album.albumID, album.albumName, album.artistName)
      );

      // Tạo một Media object "giả" đại diện cho album để truyền vào cover
      const cover: Media = {
        id: String(album.albumID),
        title: album.albumName,
        type: "audio",
        status: "published",
        url: "",
        thumbnailUrl: album.albumItemImage
        ? `http://localhost:5081/media/images/album/${album.albumItemImage}`
        : undefined,
        duration: 0,
        artist: { id: album.artistID, name: album.artistName },
        albumId: album.albumID,
        albumName: album.albumName,
        createdAt: album.uploadAt,
      };

      onOpenAlbum(cover, tracks, album.albumName);
    } catch (err) {
      console.error("Không tải được tracks của album:", err);
    }
  };

  const isEmpty =
    !loading &&
    recommended.length === 0 &&
    forYou.length === 0 &&
    upcoming.length === 0;

  const firstTrack = recommended[0] ?? forYou[0] ?? upcoming[0];

  if (loading) {
    return (
      <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: "72px", marginBottom: "18px" }}>🎵</div>

        <h2 style={{ color: "#fff", marginBottom: "10px" }}>
          Chưa có dữ liệu
        </h2>

        <p style={{ color: "#b3b3b3", maxWidth: "420px", lineHeight: 1.6 }}>
          Backend chưa trả bài hát nào. Hãy thêm dữ liệu vào bảng MediaItem rồi
          load lại trang.
        </p>
      </div>
    );
  }

  return (
    <>
      <section style={{ marginBottom: "42px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "22px",
          }}
        >
          <h1 style={{ color: "#fff", fontSize: "34px", margin: 0 }}>
            Gần đây
          </h1>

          {recentTracks.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                border: "none",
                background: "transparent",
                color: "#b3b3b3",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Xóa lịch sử
            </button>
          )}
        </div>

        {recentTracks.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "10px",
            }}
          >
            {recentTracks.slice(0, 8).map((track) => (
              <QuickPlayCard
                key={track.id}
                track={track}
                tracks={recentTracks}
                onOpenTrack={onOpenTrack}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,.08)",
              borderRadius: "12px",
              padding: "18px",
              color: "#b3b3b3",
            }}
          >
            Bạn chưa nghe bài nào gần đây.
          </div>
        )}
      </section>

      <section style={{ marginBottom: "38px" }}>
        <SectionHeader
          title="Đề xuất cho bạn"
          onShowAll={() => onShowAll("recommended")}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "10px",
          }}
        >
          {recommended.slice(0, 8).map((track) => (
            <QuickPlayCard
              key={track.id}
              track={track}
              tracks={recommended}
              onOpenTrack={onOpenTrack}
            />
          ))}
        </div>
      </section>

      {firstTrack && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 420px) 1fr",
            gap: "32px",
            marginBottom: "42px",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "#b3b3b3",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Bộ sưu tập nổi bật
            </p>

            <h2
              style={{
                color: "#fff",
                fontSize: "34px",
                margin: "0 0 12px",
              }}
            >
              {firstTrack.title}
            </h2>

            <p
              style={{
                color: "#b3b3b3",
                lineHeight: 1.6,
                marginBottom: "18px",
              }}
            >
              Nghe các bài hát đang có trong TuneVault, lấy trực tiếp từ
              database backend.
            </p>

            <button
              onClick={() => onOpenAlbum(firstTrack, forYou, "Dành cho bạn")}
              style={{
                border: "none",
                borderRadius: "999px",
                background: "#1DB954",
                color: "#000",
                padding: "13px 24px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Mở danh sách
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "18px",
            }}
          >
            {forYou.slice(0, 4).map((track) => (
              <AlbumCardLarge
                key={track.id}
                track={track}
                tracks={forYou}
                onOpenAlbum={(cover, tracks) =>
                  onOpenAlbum(cover, tracks, "Dành cho bạn")
                }
              />
            ))}
          </div>
        </section>
      )}

      <section style={{ marginBottom: "36px" }}>
        <SectionHeader
          label="Dành cho"
          title="Phan Ngọc Vinh"
          onShowAll={() => onShowAll("forYou")}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: "18px",
          }}
        >
          {forYou.slice(0, 6).map((track) => (
            <AlbumCardLarge
              key={track.id}
              track={track}
              tracks={forYou}
              onOpenAlbum={(cover, tracks) =>
                onOpenAlbum(cover, tracks, "Dành cho bạn")
              }
            />
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "36px" }}>
        <SectionHeader
          title="Album nổi bật"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(170px, 1fr))",
            gap: "18px",
          }}
        >
          {albums.slice(0, 6).map((album) => (
            <div
              key={album.albumID}
              onClick={() => handleOpenAlbumById(album)}
              style={{
                background: "#181818",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
                transition: ".2s",
              }}
            >
              <img
                src={`http://localhost:5081/media/images/album/${album.albumItemImage}`}
                alt={album.albumName}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
              />

              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                {album.albumName}
              </div>

              <div
                style={{
                  color: "#b3b3b3",
                  fontSize: "13px",
                }}
              >
                {album.artistName}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Được đề xuất cho hôm nay"
          onShowAll={() => onShowAll("upcoming")}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: "18px",
          }}
        >
          {upcoming.slice(0, 6).map((track) => (
            <AlbumCardLarge
              key={track.id}
              track={track}
              tracks={upcoming}
              onOpenAlbum={(cover, tracks) =>
                onOpenAlbum(cover, tracks, "Được đề xuất cho hôm nay")
              }
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default HomeView;