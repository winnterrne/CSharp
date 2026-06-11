import type { Media } from "../../types/media";
import { usePlayer } from "../../hooks/usePlayer";

const SearchTopResult = ({ item }: { item: Media }) => {
  const { playTrack, setQueue } = usePlayer();

  return (
    <div
      onClick={() => {
        setQueue([item]);
        playTrack(item);
      }}
      style={{
        background: "#181818",
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Kết quả hàng đầu</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "12px",
            background: "#333",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b3b3b3",
            fontSize: "42px",
          }}
        >
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            "♪"
          )}
        </div>

        <div>
          <h1>{item.title}</h1>

          <p style={{ color: "#b3b3b3" }}>
            {item.artist?.name ?? "Unknown Artist"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchTopResult;