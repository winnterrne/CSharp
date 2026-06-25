import { useNavigate } from "react-router-dom";
import type { PlaylistSearchResult } from "../../api/playlistApi";

const SearchPlaylistCard = ({
  playlist,
}: {
  playlist: PlaylistSearchResult;
}) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        navigate(`/playlist/${playlist.playlistID}`);
      }}
      style={{
        width: "100%",
        background: "#181818",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "1px solid #242424",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #7c3aed, #db2777)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 900,
          fontSize: "22px",
        }}
      >
        ♫
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "15px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {playlist.playlistName}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: "13px",
            marginTop: "4px",
          }}
        >
          Playlist
        </div>

        <div
          style={{
            color: "#777",
            fontSize: "12px",
            marginTop: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          User: {playlist.userID}
        </div>
      </div>
    </button>
  );
};

export default SearchPlaylistCard;