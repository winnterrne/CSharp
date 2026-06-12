import { useState } from "react";
import { playlistApi } from "../../api/playlistApi";
<<<<<<< HEAD

interface Props {
  open: boolean;
  onClose: () => void;
 onCreated: () => void | Promise<void>;
}

const CreatePlaylistModal = ({ open, onClose, onCreated }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
=======
import { emitPlaylistUpdated } from "../../utils/appEvents";

interface CreatePlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void | Promise<void>;
}

const CreatePlaylistModal = ({
  open,
  onClose,
  onCreated,
}: CreatePlaylistModalProps) => {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [creating, setCreating] = useState(false);
>>>>>>> origin/vinh-branch

  if (!open) return null;

  const handleCreate = async () => {
<<<<<<< HEAD
    if (!name.trim()) return;

    try {
      setLoading(true);

      await playlistApi.create({
        playlistName: name,
        description,
        isPublic: true,
      });

      await onCreated();

      setName("");
      setDescription("");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Không thể tạo playlist");
    } finally {
      setLoading(false);
=======
    try {
      if (!playlistName.trim()) {
        alert("Nhập tên playlist trước nha");
        return;
      }

      setCreating(true);

      await playlistApi.create({
        PlaylistName: playlistName.trim(),
        Description: description.trim(),
        IsPublic: isPublic,
      });

      setPlaylistName("");
      setDescription("");
      setIsPublic(true);

      emitPlaylistUpdated();
      await onCreated?.();

      onClose();
    } catch (error) {
      console.error("CREATE PLAYLIST ERROR:", error);
      alert("Tạo playlist thất bại");
    } finally {
      setCreating(false);
>>>>>>> origin/vinh-branch
    }
  };

  return (
    <div
<<<<<<< HEAD
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

=======
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          background: "#181818",
          color: "#fff",
          borderRadius: "16px",
          padding: "22px",
          boxShadow: "0 20px 60px rgba(0,0,0,.7)",
        }}
      >
        <h2 style={{ margin: "0 0 18px", fontSize: "22px" }}>
          Tạo playlist
        </h2>

        <label style={labelStyle}>Tên playlist</label>
        <input
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Playlist của tôi"
          style={inputStyle}
        />

        <label style={labelStyle}>Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả playlist..."
          rows={4}
          style={{
            ...inputStyle,
            resize: "none",
            height: "90px",
          }}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "14px",
            color: "#b3b3b3",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Công khai playlist
        </label>

>>>>>>> origin/vinh-branch
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
<<<<<<< HEAD
            marginTop: "20px",
          }}
        >
          <button onClick={onClose}>Hủy</button>

          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo"}
=======
            marginTop: "22px",
          }}
        >
          <button onClick={onClose} style={buttonSecondaryStyle}>
            Hủy
          </button>

          <button
            onClick={handleCreate}
            disabled={creating}
            style={{
              ...buttonPrimaryStyle,
              opacity: creating ? 0.7 : 1,
              cursor: creating ? "default" : "pointer",
            }}
          >
            {creating ? "Đang tạo..." : "Tạo"}
>>>>>>> origin/vinh-branch
          </button>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default CreatePlaylistModal;
=======
const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#b3b3b3",
  fontSize: "13px",
  fontWeight: 700,
  margin: "12px 0 7px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#282828",
  border: "1px solid #444",
  outline: "none",
  borderRadius: "8px",
  color: "#fff",
  padding: "12px",
  boxSizing: "border-box",
};

const buttonPrimaryStyle: React.CSSProperties = {
  background: "#1DB954",
  color: "#000",
  border: "none",
  borderRadius: "999px",
  padding: "10px 18px",
  fontWeight: 800,
};

const buttonSecondaryStyle: React.CSSProperties = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #555",
  borderRadius: "999px",
  padding: "10px 18px",
  fontWeight: 800,
  cursor: "pointer",
};

export default CreatePlaylistModal;
>>>>>>> origin/vinh-branch
