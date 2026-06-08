import { useEffect, useState } from "react";
import type { Media } from "../../types/media";
import AlbumDetailView from "../home/AlbumDetailView";
import TrackDetailView from "../home/TrackDetailView";

import HomeView from "../home/HomeView";
import ArtistDetailView from "../home/ArtistDetailView";
import AlbumCardLarge from "../home/AlbumCardLarge";
import { mediaApi } from "../../api/mediaApi";
import { mapMediaItemDtoToMedia, type MediaItemDto } from "../../types/media";

type ViewMode =
  | "home"
  | "recommended"
  | "upcoming"
  | "forYou"
  | "album"
  | "track"
  | "artist";

const MainContent = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("home");

  // NEW: lưu bài hát đang chọn
  const [selectedTrack, setSelectedTrack] = useState<Media | null>(null);

  // NEW: lưu album/playlist giả lập đang chọn
  const [selectedAlbum, setSelectedAlbum] = useState<{
    cover: Media;
    tracks: Media[];
  } | null>(null);

  const [recommended, setRecommended] = useState<Media[]>([]);
  const [forYou, setForYou] = useState<Media[]>([]);
  const [upcoming, setUpcoming] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  // NEW: lưu nghệ sĩ đang chọn
  const [selectedArtist, setSelectedArtist] = useState<{
    name: string;
    tracks: Media[];
  } | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const res = await mediaApi.getAll();

        console.log("API RESPONSE:", res.data);

        const mediaDtos: MediaItemDto[] =
          Array.isArray(res.data?.data) ? res.data.data : [];

        const mediaList: Media[] = mediaDtos.map(mapMediaItemDtoToMedia);

        console.log("MEDIA LIST:", mediaList);

        setRecommended(mediaList);
        setForYou(mediaList);
        setUpcoming(mediaList);
      } catch (err) {
        console.error("FETCH HOME DATA ERROR:", err);

        setRecommended([]);
        setForYou([]);
        setUpcoming([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);
  // const fetchHomeData = async () => {
  //   try {
  //     setLoading(true);

  // NEW: gọi dữ liệu thật từ backend
  // const [recommendedRes, forYouRes, upcomingRes] = await Promise.all([
  //   mediaApi.getRecommended(),
  //   mediaApi.getForYou(),
  //   mediaApi.getUpcoming(),
  // ]);

  // FIX: backend có thể trả res.data hoặc res.data.data
  //     setRecommended(recommendedRes.data?.data ?? recommendedRes.data ?? []);
  //     setForYou(forYouRes.data?.data ?? forYouRes.data ?? []);
  //     setUpcoming(upcomingRes.data?.data ?? upcomingRes.data ?? []);
  //   } catch (err) {
  //     console.error("FETCH HOME DATA ERROR:", err);

  //     // NEW: nếu backend lỗi thì để mảng rỗng, không crash UI
  //     setRecommended([]);
  //     setForYou([]);
  //     setUpcoming([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   fetchHomeData();
  // }, []);

  const handleOpenTrack = (track: Media) => {
    // NEW: mở màn hình chi tiết bài hát
    setSelectedTrack(track);
    setSelectedAlbum(null);
    setViewMode("track");
  };

  const handleOpenAlbum = (track: Media, tracks: Media[]) => {
    // NEW: mở màn hình album/playlist
    setSelectedAlbum({
      cover: track,
      tracks,
    });
    setSelectedTrack(null);
    setViewMode("album");
  };

  // NEW: mở trang nghệ sĩ
  const handleOpenArtist = (artistName: string, tracks: Media[]) => {
    setSelectedArtist({
      name: artistName,
      tracks: tracks.filter((track) => track.artist.name === artistName),
    }); // NEW: lấy dữ liệu cho màn hình "Hiện tất cả"

    setSelectedTrack(null);
    setSelectedAlbum(null);
    setViewMode("artist");
  };

  const getShowAllData = () => {
    if (viewMode === "recommended") {
      return {
        title: "Đề xuất cho bạn",
        tracks: recommended,
      };
    }

    if (viewMode === "upcoming") {
      return {
        title: "Được đề xuất cho hôm nay",
        tracks: upcoming,
      };
    }

    if (viewMode === "forYou") {
      return {
        title: "Dành cho bạn",
        tracks: forYou,
      };
    }

    return {
      title: "",
      tracks: [],
    };
  };
  const showAllData = getShowAllData();
  return (
    <main
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "30px",
        paddingBottom: "120px",
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #0b3b4a 0%, #121212 300px)",
      }}
    >
      {/* NEW: quay lại home */}
      {viewMode !== "home" && (
        <button
          onClick={() => {
            setViewMode("home");
            setSelectedTrack(null);
            setSelectedAlbum(null);
            setSelectedArtist(null);
          }}
          style={{
            marginBottom: "20px",
            background: "#2a2a2a",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ← Quay lại
        </button>
      )}

      {/* NEW: Home view */}
      {viewMode === "home" && (
        <HomeView
          loading={loading}
          recommended={recommended}
          forYou={forYou}
          upcoming={upcoming}
          onOpenTrack={handleOpenTrack}
          onOpenAlbum={handleOpenAlbum}
          onShowAll={(mode) => setViewMode(mode)}
        />
      )}
      {/* NEW: Show All View */}
      {(viewMode === "recommended" ||
        viewMode === "upcoming" ||
        viewMode === "forYou") && (
        <section>
          <h1
            style={{
              color: "#fff",
              fontSize: "36px",
              marginBottom: "24px",
            }}
          >
            {showAllData.title}
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "18px",
            }}
          >
            {showAllData.tracks.map((track) => (
              <AlbumCardLarge
                key={track.id}
                track={track}
                tracks={showAllData.tracks}
                onOpenAlbum={handleOpenAlbum}
              />
            ))}
          </div>
        </section>
      )}

      {/* NEW: tạm thời album view placeholder */}
      {viewMode === "album" && selectedAlbum && (
        <AlbumDetailView
          cover={selectedAlbum.cover}
          tracks={selectedAlbum.tracks}
          onOpenTrack={handleOpenTrack}
          onOpenArtist={(artistName) =>
            handleOpenArtist(artistName, [
              ...recommended,
              ...forYou,
              ...upcoming,
            ])
          }
        />
      )}

      {/* NEW: tạm thời track view placeholder */}
      {viewMode === "track" && selectedTrack && (
        <TrackDetailView
          track={selectedTrack}
          onOpenArtist={(artistName) =>
            handleOpenArtist(artistName, [
              ...recommended,
              ...forYou,
              ...upcoming,
            ])
          }
        />
      )}

      {/*New:tạm thơi artist */}
      {viewMode === "artist" && selectedArtist && (
        <ArtistDetailView
          artistName={selectedArtist.name}
          tracks={selectedArtist.tracks}
          onOpenAlbum={handleOpenAlbum}
          onOpenTrack={handleOpenTrack} // NEW
        />
      )}
    </main>
  );
};

export default MainContent;
