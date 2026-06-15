import { useState } from "react";
import type{ Album } from "../../types/album";

type Props = {
  album: Album;
  onClick?: () => void;
};

const AlbumCard = ({ album, onClick }: Props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#282828" : "#181818",
        borderRadius: "12px",
        padding: "16px",
        cursor: "pointer",
        transition: "background .18s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px",
          marginBottom: "14px",
        }}
      >
        <img
          src={album.albumItemImage}
          alt={album.albumName}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: "15px",
          fontWeight: 700,
          marginBottom: "5px",
        }}
      >
        {album.albumName}
      </div>

      <div
        style={{
          color: "#b3b3b3",
          fontSize: "13px",
        }}
      >
        {album.title}
      </div>
    </div>
  );
};

export default AlbumCard;