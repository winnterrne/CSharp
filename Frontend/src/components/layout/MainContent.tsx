import { useEffect, useMemo, useState } from "react";
import type { Media } from "../../types/media";
<<<<<<< HEAD
import AlbumDetailView from "../home/AlbumDetailView";
import TrackDetailView from "../home/TrackDetailView";
import HomeView from "../home/HomeView";
import ArtistDetailView from "../home/ArtistDetailView";
import AlbumCardLarge from "../home/AlbumCardLarge";
import { mediaApi } from "../../api/mediaApi";
import { mapMediaItemDtoToMedia, type MediaItemDto } from "../../types/media";
=======
import {
  mapMediaItemDtoToMedia,
  type MediaItemDto,
} from "../../types/media";
import { mediaApi } from "../../api/mediaApi";

import HomeView from "../home/HomeView";
import AlbumDetailView from "../home/AlbumDetailView";
import TrackDetailView from "../home/TrackDetailView";
import ArtistDetailView from "../home/ArtistDetailView";
import AlbumCardLarge from "../home/AlbumCardLarge";
>>>>>>> origin/vinh-branch

type ViewMode =
  | "home"
  | "recommended"
  | "upcoming"
  | "forYou"
  | "album"
  | "track"
  | "artist";

<<<<<<< HEAD
=======
const uniqueTracks = (tracks: Media[]) => {
  const map = new Map<string, Media>();

  tracks.forEach((track) => {
    map.set(String(track.id), track);
  });

  return Array.from(map.values());
};

>>>>>>> origin/vinh-branch
const MainContent = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("home");

  const [selectedTrack, setSelectedTrack] = useState<Media | null>(null);

  const [selectedAlbum, setSelectedAlbum] = useState<{
    cover: Media;
    tracks: Media[];
    title?: string;
  } | null>(null);

  const [selectedArtist, setSelectedArtist] = useState<{
    name: string;
    tracks: Media[];
  } | null>(null);

  const [recommended, setRecommended] = useState<Media[]>([]);
  const [forYou, setForYou] = useState<Media[]>([]);
  const [upcoming, setUpcoming] = useState<Media[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await mediaApi.getAll();

        const mediaDtos: MediaItemDto[] = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

<<<<<<< HEAD
        const mediaList: Media[] = mediaDtos.map(mapMediaItemDtoToMedia);

        setRecommended(mediaList);
        setForYou(mediaList);
        setUpcoming(mediaList);
=======
        const mediaList = uniqueTracks(mediaDtos.map(mapMediaItemDtoToMedia));

        setRecommended(mediaList.slice(0, 12));
        setForYou(mediaList.slice(4, 16));
        setUpcoming(mediaList.slice(8, 20));

        if (mediaList.length === 0) {
          setError("Chưa có dữ liệu bài hát từ server.");
        }
>>>>>>> origin/vinh-branch
      } catch (err) {
        console.error("FETCH HOME DATA ERROR:", err);

        setRecommended([]);
        setForYou([]);
        setUpcoming([]);
        setError("Không tải được dữ liệu bài hát từ server.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const allTracks = useMemo(() => {
<<<<<<< HEAD
    const map = new Map<string | number, Media>();

    [...recommended, ...forYou, ...upcoming].forEach((track) => {
      map.set(track.id, track);
    });

    return Array.from(map.values());
  }, [recommended, forYou, upcoming]);

  const handleOpenTrack = (track: Media) => {
=======
    return uniqueTracks([...recommended, ...forYou, ...upcoming]);
  }, [recommended, forYou, upcoming]);

  const handleOpenTrack = (track: Media) => {
    if (!track?.id) return;

>>>>>>> origin/vinh-branch
    setSelectedTrack(track);
    setSelectedAlbum(null);
    setSelectedArtist(null);
    setViewMode("track");
  };

  const handleOpenAlbum = (cover: Media, tracks: Media[], title?: string) => {
    setSelectedAlbum({
      cover,
      tracks,
      title,
    });

    setSelectedTrack(null);
    setSelectedArtist(null);
    setViewMode("album");
  };

  const handleOpenArtist = (artistName: string, tracks: Media[] = allTracks) => {
    const artistTracks = tracks.filter(
<<<<<<< HEAD
      (track) => track.artist?.name === artistName
=======
      (track) => track.artist?.name === artistName,
>>>>>>> origin/vinh-branch
    );

    setSelectedArtist({
      name: artistName,
      tracks: artistTracks,
    });

    setSelectedTrack(null);
    setSelectedAlbum(null);
    setViewMode("artist");
  };

  const handleBackHome = () => {
    setViewMode("home");
    setSelectedTrack(null);
    setSelectedAlbum(null);
    setSelectedArtist(null);
  };

  const getShowAllData = () => {
    switch (viewMode) {
      case "recommended":
        return {
          title: "Đề xuất cho bạn",
          tracks: recommended,
        };

<<<<<<< HEAD
      case "upcoming":
        return {
          title: "Được đề xuất cho hôm nay",
          tracks: upcoming,
        };

=======
>>>>>>> origin/vinh-branch
      case "forYou":
        return {
          title: "Dành cho bạn",
          tracks: forYou,
        };

<<<<<<< HEAD
=======
      case "upcoming":
        return {
          title: "Được đề xuất cho hôm nay",
          tracks: upcoming,
        };

>>>>>>> origin/vinh-branch
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
<<<<<<< HEAD
        paddingBottom: "120px",
=======
        paddingBottom: "160px",
>>>>>>> origin/vinh-branch
        boxSizing: "border-box",
        background:
          viewMode === "home"
            ? "linear-gradient(180deg, #0b3b4a 0%, #121212 320px)"
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
          onOpenTrack={handleOpenTrack}
          onOpenAlbum={handleOpenAlbum}
<<<<<<< HEAD
          onShowAll={(mode) => setViewMode(mode)}
=======
          onShowAll={(mode) => {
            if (mode === "recommended") setViewMode("recommended");
            if (mode === "forYou") setViewMode("forYou");
            if (mode === "upcoming") setViewMode("upcoming");
          }}
>>>>>>> origin/vinh-branch
        />
      )}

      {(viewMode === "recommended" ||
<<<<<<< HEAD
        viewMode === "upcoming" ||
        viewMode === "forYou") && (
=======
        viewMode === "forYou" ||
        viewMode === "upcoming") && (
>>>>>>> origin/vinh-branch
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

          {showAllData.tracks.length === 0 && !loading ? (
            <p style={{ color: "#b3b3b3" }}>Chưa có bài hát nào.</p>
          ) : (
            <div
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
          )}
        </section>
      )}

<<<<<<< HEAD
      {viewMode === "album" && selectedAlbum && (
        <AlbumDetailView
          cover={{
            ...selectedAlbum.cover,
            title: selectedAlbum.title ?? selectedAlbum.cover.title,
          }}
          tracks={selectedAlbum.tracks}
=======
      {viewMode === "track" &&
        (selectedTrack ? (
          <TrackDetailView
            track={selectedTrack}
            onOpenArtist={handleOpenArtist}
          />
        ) : (
          <div style={{ color: "#fff", padding: "40px" }}>
            Không tìm thấy bài hát.
          </div>
        ))}

      {viewMode === "album" && selectedAlbum && (
        <AlbumDetailView
          cover={selectedAlbum.cover}
          tracks={selectedAlbum.tracks}
          title={selectedAlbum.title}
>>>>>>> origin/vinh-branch
          onOpenTrack={handleOpenTrack}
          onOpenArtist={handleOpenArtist}
        />
      )}

<<<<<<< HEAD
      {viewMode === "track" && selectedTrack && (
        <TrackDetailView
          track={selectedTrack}
          onOpenArtist={handleOpenArtist}
        />
      )}

=======
>>>>>>> origin/vinh-branch
      {viewMode === "artist" && selectedArtist && (
        <ArtistDetailView
          artistName={selectedArtist.name}
          tracks={selectedArtist.tracks}
<<<<<<< HEAD
          onOpenAlbum={handleOpenAlbum}
          onOpenTrack={handleOpenTrack}
=======
          onOpenTrack={handleOpenTrack}
          onOpenAlbum={handleOpenAlbum}
>>>>>>> origin/vinh-branch
        />
      )}
    </main>
  );
};

export default MainContent;