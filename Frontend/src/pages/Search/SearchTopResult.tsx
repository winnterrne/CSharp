import type { Media } from "../../types/media";

const SearchTopResult = ({
  item,
}: {
  item: Media;
}) => {
  return (
    <div
      style={{
        background: "#181818",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        Kết quả hàng đầu
      </h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />

        <div>
          <h1>{item.title}</h1>

          <p
            style={{
              color: "#b3b3b3",
            }}
          >
            {item.artist.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchTopResult;