import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Media } from "../../types/media";
import {
  mapMediaItemDtoToMedia,
  type MediaItemDto,
} from "../../types/media";
import { mediaApi } from "../../api/mediaApi";
import ArtistDetailView from "../../components/home/ArtistDetailView";
import { usePlayer } from "../../hooks/usePlayer";

const uniqueTracks = (tracks: Media[]) => {
  const map = new Map<string, Media>();

  tracks.forEach((track) => {
    map.set(String(track.id), track);
  });

  return Array.from(map.values());
};

const ArtistPage = () => {
  const navigate = useNavigate();
  const { artistName } = useParams();

  const { playTrack, setQueue } = usePlayer();

  const decodedArtistName = artistName
    ? decodeURIComponent(artistName)
    : "Unknown Artist";

  const [tracks, setTracks] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [artistId, setArtistId] = useState(0);

  useEffect(() => {
    const loadArtistData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await mediaApi.getAll();

        const mediaDtos: MediaItemDto[] = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        const mediaList = uniqueTracks(mediaDtos.map(mapMediaItemDtoToMedia));

        const artistTracks = mediaList.filter(
          (track) =>
            track.artist?.name?.toLowerCase() === decodedArtistName.toLowerCase()
        );

        setTracks(artistTracks);
        if (artistTracks.length > 0) {  // ← THÊM ĐOẠN NÀY
          const id = Number(artistTracks[0].artist?.id || 0);
          setArtistId(id);
          console.log("artistId from tracks:", id, "artist:", artistTracks[0].artist);
        }
        if (artistTracks.length === 0) {
          setError("Không tìm thấy bài hát/video của nghệ sĩ này.");
        }
      } catch (err) {
        console.error("LOAD ARTIST PAGE ERROR:", err);
        setTracks([]);
        setError("Không tải được thông tin nghệ sĩ.");
      } finally {
        setLoading(false);
      }
    };

    loadArtistData();
  }, [decodedArtistName]);

  const handleOpenTrack = (track: Media) => {
    setQueue(tracks);
    playTrack(track);

    navigate(`/track/${track.id}`, {
      state: {
        track,
      },
    });
  };

  const handleOpenAlbum = (track: Media) => {
    if (!track.albumId) {
      console.warn("Không tìm thấy albumId:", track);
      return;
    }

    navigate(`/album/${track.albumId}`);
  };

  if (loading) {
    return (
      <main
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "30px",
          boxSizing: "border-box",
          color: "#fff",
          background: "linear-gradient(180deg, #16485a 0%, #121212 360px)",
        }}
      >
        Đang tải thông tin nghệ sĩ...
      </main>
    );
  }

  return (
    <main
      style={{
        height: "100%",
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "30px",
        paddingBottom: "160px",
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #16485a 0%, #121212 360px)",
      }}
    >
      <button
        onClick={() => navigate(-1)}
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

      <ArtistDetailView
        artistId={artistId}
        artistName={decodedArtistName}
        artistImage=""
        tracks={tracks}
        onOpenTrack={handleOpenTrack}
        onOpenAlbum={handleOpenAlbum}
      />
    </main>
  );
};

export default ArtistPage;