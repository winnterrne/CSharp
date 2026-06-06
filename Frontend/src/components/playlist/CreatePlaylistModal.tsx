import { useState } from "react";
import { playlistApi } from "../../api/playlistApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreatePlaylistModal = ({ open, onClose, onCreated }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      await playlistApi.create({
        playlistName: name,
        description,
        isPublic: true,
      });

      onCreated();

      setName("");
      setDescription("");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Không thể tạo playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#282828",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h2 style={{ color: "#fff" }}>Tạo Playlist</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên playlist"
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "#3e3e3e",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
          }}
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả"
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "12px",
            background: "#3e3e3e",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button onClick={onClose}>Hủy</button>

          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
