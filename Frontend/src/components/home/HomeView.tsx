import QuickPlayCard from "./QuickPlayCard";
import SectionHeader from "./SectionHeader";
import { useHistoryStore } from "../../store/historyStore";
import type { Album } from "../../types/album";
import { albumApi } from "../../api/albumApi";
import { mapAlbumTrackToMedia, type Media } from "../../types/media";
import type { RecommendationSong } from "../../types/recommendation";
import { mapRecommendationToMedia } from "../../types/recommendation";

type HomeViewProps = {
  loading: boolean;
  recommended: Media[];
  forYou: Media[];
  upcoming: Media[];
  albums: Album[];
  allTracks: Media[];

  aiRecommendations: RecommendationSong[];
  loadingAI: boolean;
  onRefreshAI: () => void;
  onOpenTrack: (track: Media) => void;
  onOpenAlbum: (track: Media, tracks: Media[], title?: string) => void;
  onShowAll: (mode: "recommended" | "upcoming" | "forYou" | "all") => void;
};

const HomeView = ({
  loading,
  recommended,
  forYou,
  upcoming,
  albums, 
  allTracks,

  aiRecommendations,
  loadingAI,
  onRefreshAI,

  onOpenTrack,
  onOpenAlbum,
  onShowAll,
}: HomeViewProps) => {
  const recentTracks = useHistoryStore((state) => state.recentTracks);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const handleOpenAlbumById = async (album: Album) => {
    try {
      const res = await albumApi.getTracks(album.albumID);
      const rawTracks = res.data?.data ?? [];

      const tracks: Media[] = rawTracks.map((item) =>
        mapAlbumTrackToMedia(
          item,
          album.albumID,
          album.albumName,
          album.artistName
        )
      );

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
        artist: {
          id: album.artistID,
          name: album.artistName,
        },
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

  console.log(
  recentTracks.map(t => ({
    id: t.id,
    title: t.title
  }))
);

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
            {recentTracks.slice(0, 10).map((track) => (
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

      <section style={{ marginBottom: "36px" }}>
        <SectionHeader title="Album nổi bật" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
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

      <section style={{ marginBottom: "36px" }}>
        <SectionHeader title="🤖 Gợi ý bằng AI" />
          <div style={{ marginBottom: "16px" }}>
            <button
              onClick={onRefreshAI}
              disabled={loadingAI}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              🔄 Làm mới gợi ý
            </button>
          </div>
        {loadingAI ? (
          <div style={{ color: "#b3b3b3" }}>
            Đang phân tích sở thích...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "18px",
            }}
          >
            {aiRecommendations.map((song) => (
              <div
                key={song.mediaItemID}
                onClick={() => onOpenTrack(mapRecommendationToMedia(song))}
                style={{
                  background: "#181818",
                  borderRadius: "12px",
                  padding: "16px",
                  cursor: "pointer",
                }}  
              >
                <img
                  src={`http://localhost:5081/media/images/media/${song.mediaItemImage}`}
                  alt={song.titleName}
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
                  {song.titleName}
                </div>

                <div
                  style={{
                    color: "#b3b3b3",
                    fontSize: "13px",
                  }}
                >
                  {song.artistName}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: "36px" }}>
        <SectionHeader
          title="Tất cả bài hát"
          onShowAll={() => onShowAll("all")} // ← dùng mode "all"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: "18px",
          }}
        >
          {allTracks.slice(0, 12).map((track) => ( // ← slice 12 để preview
            <div
              key={track.id}
              onClick={() => onOpenTrack(track)}
              style={{
                background: "#181818",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
                transition: "background .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#282828")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#181818")}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "12px",
                  background: "#282828",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}
              >
                {track.thumbnailUrl ? (
                  <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : "🎵"}
              </div>

              <div style={{ color: "#fff", fontWeight: 700, marginBottom: "4px",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {track.title}
              </div>

              <div style={{ color: "#b3b3b3", fontSize: "13px",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {track.artist?.name ?? "Unknown Artist"}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomeView;