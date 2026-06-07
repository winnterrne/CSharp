import type { Media } from "../../types/media";
import QuickPlayCard from "./QuickPlayCard";
import AlbumCardLarge from "./AlbumCardLarge";
import SectionHeader from "./SectionHeader";
import { useHistoryStore } from "../../store/historyStore";

type HomeViewProps = {
  loading: boolean;
  recommended: Media[];
  forYou: Media[];
  upcoming: Media[];
  onOpenTrack: (track: Media) => void;
  onOpenAlbum: (track: Media, tracks: Media[]) => void;
  onShowAll: (mode: "recommended" | "upcoming" | "forYou") => void;
};

const HomeView = ({
  loading,
  recommended,
  forYou,
  upcoming,
  onOpenTrack,
  onOpenAlbum,
  onShowAll,
}: HomeViewProps) => {
  // NEW: lấy lịch sử bài hát đã nghe từ localStorage
  const recentTracks = useHistoryStore((state) => state.recentTracks);
  // NEW: xóa lịch sử nghe gần đây
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  // NEW: kiểm tra có dữ liệu hay không
  const isEmpty =
    !loading &&
    recommended.length === 0 &&
    forYou.length === 0 &&
    upcoming.length === 0;

  return (
    <>
      {isEmpty && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              marginBottom: "20px",
            }}
          >
            🎵
          </div>

          <h2
            style={{
              color: "#fff",
              marginBottom: "10px",
            }}
          >
            Chưa có dữ liệu
          </h2>

          <p
            style={{
              color: "#b3b3b3",
              maxWidth: "400px",
            }}
          >
            Chưa có bài hát nào từ hệ thống. Hãy thêm dữ liệu từ backend để hiển
            thị nội dung.
          </p>
        </div>
      )}
      {/* NEW: Recently Played */}
      {recentTracks.length > 0 && (
        <section style={{ marginBottom: "32px" }}>
          <SectionHeader
            title="Nghe gần đây"
            actionText="Xóa lịch sử"
            onShowAll={clearHistory}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "18px",
            }}
          >
            {recentTracks.slice(0, 6).map((track) => (
              <AlbumCardLarge
                key={track.id}
                track={track}
                tracks={recentTracks}
                onOpenAlbum={onOpenAlbum}
              />
            ))}
          </div>
        </section>
      )}
      {/* NEW: Quick play */}
      <SectionHeader
        title="Đề xuất cho bạn"
        onShowAll={() => onShowAll("recommended")}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "8px",
          marginBottom: "32px",
        }}
      >
        {!loading &&
          recommended
            .slice(0, 8)
            .map((track) => (
              <QuickPlayCard
                key={track.id}
                track={track}
                tracks={recommended}
                onOpenTrack={onOpenTrack}
              />
            ))}
      </div>

      {/* NEW: Album / playlist cards */}
      <section style={{ marginBottom: "32px" }}>
        <SectionHeader
          label="Dành Cho"
          title="Phan Ngọc Vinh"
          onShowAll={() => onShowAll("forYou")}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "18px",
          }}
        >
          {!loading &&
            forYou
              .slice(0, 6)
              .map((track) => (
                <AlbumCardLarge
                  key={track.id}
                  track={track}
                  tracks={forYou}
                  onOpenAlbum={onOpenAlbum}
                />
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
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "18px",
          }}
        >
          {!loading &&
            upcoming
              .slice(0, 6)
              .map((track) => (
                <AlbumCardLarge
                  key={track.id}
                  track={track}
                  tracks={upcoming}
                  onOpenAlbum={onOpenAlbum}
                />
              ))}
        </div>
      </section>
    </>
  );
};

export default HomeView;
