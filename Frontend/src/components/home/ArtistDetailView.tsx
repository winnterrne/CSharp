import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";
import AlbumCardLarge from "./AlbumCardLarge";
import { NowPlayingIcon, PlayIcon } from "../common/icons";
import { useFollowStore } from "../../store/followStore";
import { useEffect, useState } from "react";
import { artistApi } from "../../api/artistApi";

type ArtistDetailViewProps = {
  artistId: number;
  artistName: string;
  artistImage?: string;
  tracks: Media[];
  onOpenAlbum: (track: Media, tracks: Media[]) => void;
  onOpenTrack: (track: Media) => void;
};

type ArtistProfile = {
  artistID: number;
  artistName: string;
  artistImage: string;
  bio: string;
};



const ArtistDetailView = ({
  
  artistId,
  artistName,
  artistImage = "",
  tracks,
  onOpenAlbum,
  onOpenTrack,
}: ArtistDetailViewProps) => {
  
  const { currentTrack, isPlaying, playTrack, setQueue, togglePlay } =
    usePlayer();


  const {
    toggleFollow,
    isFollowing,
  } = useFollowStore();

  const firstTrack = tracks[0];
  const isCurrentArtistTrack =
    !!firstTrack && String(currentTrack?.id) === String(firstTrack.id);

  const isArtistPlaying = isCurrentArtistTrack && isPlaying;

  const isFollowed = isFollowing(artistId);

  const handlePlayArtist = () => {
    if (tracks.length === 0) return;

    if (isCurrentArtistTrack) {
      togglePlay();
      return;
    }

    setQueue(tracks);
    playTrack(tracks[0]);
  };

const handleFollowToggle = async () => {
  if (artistId === undefined || artistId === null) {
    console.error("artistId is missing");
    return;
  }
  const id = Number(artistId);
  console.log("artistId =", id, typeof artistId);
  if (Number.isNaN(id)) {
    console.error("ArtistId invalid:", artistId);
    return;
  }
  await toggleFollow(id, artistName, artistImage || "");
  console.log({
  artistId,
  artistName,
  artistImage,
});
};

const [profile, setProfile] =
  useState<ArtistProfile | null>(null);

useEffect(() => {
  console.log("ARTIST DETAIL RECEIVED:", {
    artistId,
    artistName,
    tracksCount: tracks.length,
  });
  const loadProfile = async () => {
    try {
      const res = await artistApi.getProfile(artistId);
      console.log("PROFILE RESPONSE:", res.data);

      setProfile(res.data);
    } catch (err) {
      console.error("LOAD ARTIST PROFILE ERROR", err);
    }
  };

  if (artistId) {
    loadProfile();
  }
}, [artistId]);

  return (
    <div>

      {/* ================= HEADER ================= */}
      <section
        style={{
          minHeight: "280px",
          display: "flex",
          alignItems: "flex-end",
          padding: "32px",
          margin: "-30px -30px 28px",
          background:
            "linear-gradient(180deg, rgba(29,185,84,.45) 0%, #121212 100%)",
        }}
      >
        <div>
          <p style={{ color: "#fff", fontWeight: 700, marginBottom: "10px" }}>
            ✓ Nghệ sĩ đã xác minh
          </p>

          <h1
            style={{
              color: "#fff",
              fontSize: "72px",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {artistName}
          </h1>

          <p
            style={{
              color: "#fff",
              marginTop: "18px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            {tracks.length * 1200} người nghe hàng tháng
          </p>
        </div>
      </section>

      {/* ================= ACTION BAR ================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {/* PLAY */}
        <button
          onClick={handlePlayArtist}
          disabled={tracks.length === 0}
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            border: "none",
            background: tracks.length === 0 ? "#333" : "#1DB954",
            cursor: tracks.length === 0 ? "not-allowed" : "pointer",
            fontSize: "22px",
            fontWeight: 800,
          }}
        >
          {isArtistPlaying ? <NowPlayingIcon/> : <PlayIcon />}
        </button>

        {/* FOLLOW */}
        <button
          onClick={handleFollowToggle}
          style={{
            background: isFollowed ? "#1DB954" : "transparent",
            border: isFollowed ? "none" : "1px solid #727272",
            borderRadius: "999px",
            color: isFollowed ? "#000" : "#fff",
            padding: "8px 20px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            minWidth: "120px",
          }}
        >
          {isFollowed ? "✓ Đang theo dõi" : "Theo dõi"}
        </button>

        {/* MORE */}
        <button
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "26px",
            cursor: "pointer",
          }}
        >
          ⋯
        </button>
      </div>

      {/* ================= POPULAR ================= */}
      <section style={{ marginBottom: "36px" }}>
        <h2 style={{ color: "#fff", fontSize: "22px", marginBottom: "16px" }}>
          Phổ biến
        </h2>

        {tracks.slice(0, 5).map((track, index) => (
          <div
            key={track.id}
            onClick={() => onOpenTrack(track)}
            onDoubleClick={() => {
              setQueue(tracks);
              playTrack(track);
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "40px minmax(0, 1fr) 100px",
              alignItems: "center",
              height: "58px",
              padding: "0 8px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#1a1a1a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div style={{ color: "#b3b3b3" }}>{index + 1}</div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: 0,
              }}
            >
              {track.thumbnailUrl ? (
                <img
                  src={track.thumbnailUrl}
                  alt={track.title}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "6px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "6px",
                    background: "#282828",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#b3b3b3",
                    fontSize: "12px",
                  }}
                >
                  ♪
                </div>
              )}

              <div
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {track.title}
              </div>
            </div>

            <div style={{ color: "#b3b3b3", textAlign: "right" }}>
              {Math.floor(track.duration / 60)}:
              {String(Math.floor(track.duration % 60)).padStart(2, "0")}
            </div>
          </div>
        ))}
      </section>

      {/* ================= ABOUT ================= */}
      <section
  style={{
    marginBottom: "36px",
    background: "#181818",
    borderRadius: "16px",
    overflow: "hidden",
  }}
>
  {profile?.artistImage && (
    <img
      src={`http://localhost:5081/media/images/artist/${profile.artistImage}`}
      alt={profile.artistName}
      style={{
        width: "100%",
        height: "420px",
        objectFit: "cover",
        display: "block",
      }}
    />
  )}

  <div
    style={{
      padding: "24px",
    }}
  >
    <h2
      style={{
        color: "#fff",
        marginBottom: "16px",
      }}
    >
      {profile?.artistName ?? artistName}
    </h2>

    <p
      style={{
        color: "#b3b3b3",
        lineHeight: 1.8,
        fontSize: "15px",
      }}
    >
      {profile?.bio ?? "Chưa có thông tin nghệ sĩ."}
    </p>
  </div>
</section>

      {/* ================= ALBUM ================= */}
      <section>
        <h2 style={{ color: "#fff", fontSize: "22px", marginBottom: "16px" }}>
          Album / Playlist
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "18px",
          }}
        >
          {tracks.slice(0, 6).map((track) => (
            <AlbumCardLarge
              key={track.id}
              track={track}
              tracks={tracks}
              onOpenAlbum={onOpenAlbum}
            />
          ))}
        </div>
      </section>

      {!firstTrack && (
        <p style={{ color: "#b3b3b3" }}>
          Chưa có bài hát của nghệ sĩ này.
        </p>
      )}
    </div>
  );
};

export default ArtistDetailView;