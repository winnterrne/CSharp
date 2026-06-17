import { useLocation, useNavigate } from "react-router-dom";
import type { Media } from "../../types/media";
import TrackDetailView from "../../components/home/TrackDetailView";

const TrackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const track = location.state?.track as Media | undefined;

  if (!track) {
    return (
      <div
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "40px",
          boxSizing: "border-box",
          color: "#fff",
          background: "linear-gradient(180deg, #16485a 0%, #121212 360px)",
        }}
      >
        Không tìm thấy bài hát.
      </div>
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

      <TrackDetailView
        track={track}
        onOpenArtist={(artistName) => {
          navigate(`/artist/${encodeURIComponent(artistName)}`);
        }}
      />
    </main>
  );
};

export default TrackPage;