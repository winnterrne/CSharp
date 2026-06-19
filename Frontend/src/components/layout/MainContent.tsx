import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Media } from "../../types/media";
import { mapMediaItemDtoToMedia, type MediaItemDto } from "../../types/media";
import { mediaApi } from "../../api/mediaApi";

import HomeView from "../home/HomeView";
import TrackDetailView from "../home/TrackDetailView";
import ArtistDetailView from "../home/ArtistDetailView";
import AlbumCardLarge from "../home/AlbumCardLarge";
import type { Album } from "../../types/album";
import { albumApi } from "../../api/albumApi";
import { useAlbumStore } from "../../store/albumStore";
import { mapAlbumTrackToMedia } from "../../types/media";
import { useRecommendationStore } from "../../store/recommendationStore";

type ViewMode =
  | "home"
  | "recommended"
  | "upcoming"
  | "forYou"
  | "track"
  | "artist";

const uniqueTracks = (tracks: Media[]) => {
  const map = new Map<string, Media>();

  tracks.forEach((track) => {
    map.set(String(track.id), track);
  });

  return Array.from(map.values());
};

const getAlbumIdFromCover = (cover: Media | Album) => {
  const item = cover as any;

  return (
    item.albumID ??
    item.albumId ??
    item.albumID ??
    item.id ??
    item.mediaItemID ??
    item.mediaItemId
  );
};

const MainContent = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [selectedTrack, setSelectedTrack] = useState<Media | null>(null);

  const [selectedArtist, setSelectedArtist] = useState<{
    id: number;
    name: string;
    image?: string;
    tracks: Media[];
  } | null>(null);

  const [recommended, setRecommended] = useState<Media[]>([]);
  const [forYou, setForYou] = useState<Media[]>([]);
  const [upcoming, setUpcoming] = useState<Media[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { aiRecommendations, loadingAI, loadAIRecommendations } = useRecommendationStore();
  const selectedAlbumId = useAlbumStore((s) => s.selectedAlbumId);
  const setSelectedAlbumId = useAlbumStore((s) => s.setSelectedAlbumId);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const [mediaRes, albumRes] = await Promise.all([
          mediaApi.getAll(),
          albumApi.getAll(),
        ]);

        const mediaDtos: MediaItemDto[] =
          Array.isArray(mediaRes.data?.data) ? mediaRes.data.data : [];

        const mediaList = uniqueTracks(mediaDtos.map(mapMediaItemDtoToMedia));

        setRecommended(mediaList.slice(0, 12));
        setForYou(mediaList.slice(4, 16));
        setUpcoming(mediaList.slice(8, 20));
        setAlbums(albumRes.data?.data ?? []);

        const albumList =
          Array.isArray(albumRes.data?.data) ? albumRes.data.data
          : Array.isArray(albumRes.data) ? albumRes.data
          : [];

        setAlbums(albumList);

        if (mediaList.length === 0) {
          setError("Chưa có dữ liệu bài hát từ server.");
        }
      } catch (err) {
        console.error("FETCH HOME DATA ERROR:", err);
        setRecommended([]);
        setForYou([]);
        setUpcoming([]);
        setAlbums([]);
        setError("Không tải được dữ liệu bài hát từ server.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
  if (aiRecommendations.length === 0) {
    loadAIRecommendations();
  }
}, [aiRecommendations, loadAIRecommendations]);
    

  const allTracks = useMemo(() => {
    return uniqueTracks([...recommended, ...forYou, ...upcoming]);
  }, [recommended, forYou, upcoming]);

  const handleOpenTrack = (track: Media) => {
    if (!track?.id) return;

    setSelectedTrack(track);
    setSelectedArtist(null);
    setViewMode("track");
  };

  const handleOpenAlbum = (
    cover: Media | Album,
    _tracks: Media[] = [],
    _title?: string,
  ) => {
    const albumId = getAlbumIdFromCover(cover);

    if (!albumId) {
      console.warn("Không tìm thấy albumId:", cover);
      return;
    }

    navigate(`/album/${albumId}`);
  };

  useEffect(() => {
    if (!selectedAlbumId) return;

    const album = albums.find((a) => a.albumID === selectedAlbumId);
    if (!album) return;

    const openAlbum = async () => {
      try {
        const res = await albumApi.getTracks(selectedAlbumId);
        const rawTracks = res.data?.data ?? [];

        const tracks = rawTracks.map((item) =>
          mapAlbumTrackToMedia(
            item,
            album.albumID,
            album.albumName,
            album.artistName,
          ),
        );

        const cover = {
          id: String(album.albumID),
          title: album.albumName,
          type: "audio" as const,
          status: "published" as const,
          url: "",
          thumbnailUrl:
            album.albumItemImage ?
              `http://localhost:5081/media/images/album/${album.albumItemImage}`
            : undefined,
          duration: 0,
          artist: { id: album.artistID, name: album.artistName },
          albumId: album.albumID,
          albumName: album.albumName,
          createdAt: album.uploadAt,
        };

        handleOpenAlbum(cover, tracks, album.albumName);
      } catch (err) {
        console.error("Không tải được album từ sidebar:", err);
      } finally {
        setSelectedAlbumId(null); // reset sau khi mở
      }
    };

  openAlbum();
}, [selectedAlbumId,  albums]);

  const handleOpenArtist = (
    artistID: number,
    artistName: string,
    artistImage: string,
    tracks: Media[] = allTracks,
    
  ) => {
    console.log("HANDLE OPEN ARTIST", {
      artistID,
      artistName,
      artistImage,
      allTracksCount: allTracks.length,
    });
    const artistTracks = tracks.filter(
      (track) => track.artist?.id === artistID,
    );
    console.log("ARTIST TRACKS", artistTracks);

    setSelectedArtist({
      id: artistID,
      name: artistName,
      image: artistImage,
      tracks: artistTracks,
    });

    setSelectedTrack(null);
    setViewMode("artist");

    console.log("OPEN ARTIST", {
      artistID,
      artistName,
      artistImage,
    });
  };

  const handleBackHome = () => {
    setViewMode("home");
    setSelectedTrack(null);
    setSelectedArtist(null);
  };
  

  // ✅ NOTIFICATION FLOW: nút Home trên Header quay về home
useEffect(() => {
  window.addEventListener("tunevault:go-home", handleBackHome);

  return () => {
    window.removeEventListener("tunevault:go-home", handleBackHome);
  };
}, []);

// ✅ NOTIFICATION FLOW: mở TrackDetailView từ Notification
useEffect(() => {
  const openTrack = (track: Media) => {
    setSelectedTrack(track);
    setSelectedArtist(null);
    setViewMode("track");
  };

  const handleOpenTrackFromNotification = (event: Event) => {
    const custom = event as CustomEvent<Media>;

    if (!custom.detail) return;

    openTrack(custom.detail);
  };

  window.addEventListener(
    "tunevault:open-track",
    handleOpenTrackFromNotification,
  );

  const pendingTrack =
    sessionStorage.getItem("tunevault:pending-open-track");

  if (pendingTrack) {
    try {
      const track = JSON.parse(pendingTrack) as Media;
      openTrack(track);
    } catch (error) {
      console.error("OPEN PENDING TRACK ERROR:", error);
    } finally {
      sessionStorage.removeItem("tunevault:pending-open-track");
    }
  }

  return () => {
    window.removeEventListener(
      "tunevault:open-track",
      handleOpenTrackFromNotification,
    );
  };
}, []);

  const getShowAllData = () => {
    switch (viewMode) {
      case "recommended":
        return {
          title: "Đề xuất cho bạn",
          tracks: recommended,
        };

      case "forYou":
        return {
          title: "Dành cho bạn",
          tracks: forYou,
        };

      case "upcoming":
        return {
          title: "Được đề xuất cho hôm nay",
          tracks: upcoming,
        };

      default:
        return {
          title: "",
          tracks: [],
        };
    }
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
        paddingBottom: "160px",
        boxSizing: "border-box",
        background:
          viewMode === "home" ?
            "linear-gradient(180deg, #0b3b4a 0%, #121212 320px)"
          : "linear-gradient(180deg, #16485a 0%, #121212 360px)",
      }}
    >
      {viewMode !== "home" && (
        <button
          onClick={handleBackHome}
          style={{
            marginBottom: "20px",
            background: "rgba(0,0,0,.45)",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            width: "38px",
            height: "38px",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: "18px",
          }}
        >
          ‹
        </button>
      )}

      {error && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(255, 80, 80, 0.15)",
            color: "#ffb4b4",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {viewMode === "home" && (
        <HomeView
          loading={loading}
          recommended={recommended}
          forYou={forYou}
          upcoming={upcoming}
          albums={albums}
          aiRecommendations={aiRecommendations}
          loadingAI={loadingAI}
          onRefreshAI={loadAIRecommendations}
          onOpenTrack={handleOpenTrack}
          onOpenAlbum={handleOpenAlbum}
          onShowAll={(mode) => {
            if (mode === "recommended") setViewMode("recommended");
            if (mode === "forYou") setViewMode("forYou");
            if (mode === "upcoming") setViewMode("upcoming");
          }}
        />
      )}

      {(viewMode === "recommended" ||
        viewMode === "forYou" ||
        viewMode === "upcoming") && (
        <section>
          <h1
            style={{
              color: "#fff",
              fontSize: "38px",
              marginBottom: "24px",
            }}
          >
            {showAllData.title}
          </h1>

          {showAllData.tracks.length === 0 && !loading ?
            <p style={{ color: "#b3b3b3" }}>Chưa có bài hát nào.</p>
          : <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                gap: "20px",
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
          }
        </section>
      )}

      {viewMode === "track" &&
        (selectedTrack ?
          <TrackDetailView
            track={selectedTrack}
            onOpenArtist={handleOpenArtist}
          />
        : <div style={{ color: "#fff", padding: "40px" }}>
            Không tìm thấy bài hát.
          </div>)}

      {viewMode === "artist" && selectedArtist && (
        <ArtistDetailView
          artistId={selectedArtist.id}
          artistName={selectedArtist.name}
          artistImage={selectedArtist.image}
          tracks={selectedArtist.tracks}
          onOpenTrack={handleOpenTrack}
          onOpenAlbum={handleOpenAlbum}
        />
      )}
    </main>
  );
};

export default MainContent;
