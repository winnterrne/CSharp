import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ChangeEvent, DragEvent } from "react";
import { mediaApi } from "../../api/mediaApi";
import { artistApi } from "../../api/artistApi";
import { albumApi } from "../../api/albumApi";
import type { Album } from "../../types/album";

interface Artist {
  artistID: number;
  artistName: string;
  artistImage?: string | null;
}

interface UploadMediaModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

interface FormState {
  title: string;
  description: string;
  albumID: string;
  mediaItemTag: string;
  mediaItemType: string;
  duration: string;
}

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  albumID: "",
  mediaItemTag: "",
  mediaItemType: "audio",
  duration: "",
};

const UploadMediaModal = ({ open, onClose, onUploaded }: UploadMediaModalProps) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [audioDragging, setAudioDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Artist search state
  const [artistSearch, setArtistSearch] = useState("");
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);
  const [artistLoading, setArtistLoading] = useState(false);
  const artistSearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const artistDropdownRef = useRef<HTMLDivElement>(null);
  const albumDropdownRef = useRef<HTMLDivElement>(null);

  // Album state
  const [albumResults, setAlbumResults] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumDropdownOpen, setAlbumDropdownOpen] = useState(false);
  const [albumLoading, setAlbumLoading] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Fetch albums của artist đã chọn
  useEffect(() => {
    if (!selectedArtist) {
      setAlbumResults([]);
      setSelectedAlbum(null);
      return;
    }
    (async () => {
      try {
        setAlbumLoading(true);
        const res = await albumApi.getAll();
        const all: Album[] = res.data?.data ?? [];
        // Filter theo artistID ở client
        const filtered = all.filter((a) => a.artistID === selectedArtist.artistID);
        setAlbumResults(filtered);
      } catch {
        setAlbumResults([]);
      } finally {
        setAlbumLoading(false);
      }
    })();
  }, [selectedArtist]);

  // Đóng album dropdown khi click ra ngoài
  useEffect(() => {
    if (!albumDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (albumDropdownRef.current && !albumDropdownRef.current.contains(e.target as Node)) {
        setAlbumDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [albumDropdownOpen]);

  // Fetch artists khi search thay đổi (debounce 300ms)
  // API: GET /Artist?KeyWord=...&PageNumber=1&PageSize=10
  // Response shape: { success, data: { artists: [...] } }
  useEffect(() => {
    if (!open) return;
    if (artistSearchTimeout.current) clearTimeout(artistSearchTimeout.current);

    const delay = artistSearch.trim() ? 300 : 0;

    artistSearchTimeout.current = setTimeout(async () => {
      try {
        setArtistLoading(true);
        const res = await artistApi.search(artistSearch.trim());
        // Đọc đúng shape: res.data.data.artists
        const artists = res.data?.data?.artists;
        setArtistResults(Array.isArray(artists) ? artists : []);
      } catch {
        setArtistResults([]);
      } finally {
        setArtistLoading(false);
      }
    }, delay);
  }, [artistSearch, open]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!artistDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (artistDropdownRef.current && !artistDropdownRef.current.contains(e.target as Node)) {
        setArtistDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [artistDropdownOpen]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    if (loading) return;
    setForm(INITIAL_FORM);
    setAudioFile(null);
    setThumbFile(null);
    setThumbPreview(null);
    setError(null);
    setSuccess(false);
    setSelectedArtist(null);
    setArtistSearch("");
    setArtistDropdownOpen(false);
    setSelectedAlbum(null);
    setAlbumResults([]);
    setAlbumDropdownOpen(false);
    onClose();
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAudioChange = (file: File | null) => {
    if (!file) return;
    setAudioFile(file);
    if (!form.title) {
      const name = file.name.replace(/\.[^/.]+$/, "");
      setForm((prev) => ({ ...prev, title: name }));
    }
  };

  const handleThumbChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setThumbFile(file);
    const reader = new FileReader();
    reader.onload = () => setThumbPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAudioDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setAudioDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("audio/")) handleAudioChange(file);
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setArtistSearch(artist.artistName);
    setArtistDropdownOpen(false);
  };

  const handleClearArtist = () => {
    setSelectedArtist(null);
    setArtistSearch("");
    setSelectedAlbum(null);
    setAlbumResults([]);
    setForm((prev) => ({ ...prev, albumID: "" }));
  };

  const handleSubmit = async () => {
    if (!audioFile) { setError("Vui lòng chọn file audio."); return; }
    if (!form.title.trim()) { setError("Vui lòng nhập tên bài hát."); return; }
    if (!selectedArtist) { setError("Vui lòng chọn nghệ sĩ từ danh sách."); return; }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("File", audioFile);
      formData.append("TitleName", form.title.trim());
      formData.append("ArtistID", String(selectedArtist.artistID));
      if (form.description.trim()) formData.append("Description", form.description.trim());
      if (form.mediaItemTag.trim()) formData.append("MediaItemTag", form.mediaItemTag.trim());
      if (form.mediaItemType) formData.append("MediaItemType", form.mediaItemType);
      if (form.albumID) formData.append("AlbumID", form.albumID);
      if (form.duration) formData.append("Duration", form.duration);
      if (thumbFile) formData.append("Thumbnail", thumbFile);

      await mediaApi.upload(formData);

      setSuccess(true);
      setTimeout(() => {
        onUploaded?.();
        handleClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Upload thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff" }}>⬆️ Upload nhạc</span>
          <button style={closeBtnStyle} onClick={handleClose} disabled={loading}>✕</button>
        </div>

        <div style={bodyStyle}>
          {/* Audio drop zone */}
          <div
            style={{
              ...dropZoneStyle,
              borderColor: audioDragging ? "#1DB954" : audioFile ? "#1DB954" : "#3a3a3a",
              background: audioDragging ? "#1a2e1a" : audioFile ? "#162316" : "#1e1e1e",
            }}
            onClick={() => audioInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setAudioDragging(true); }}
            onDragLeave={() => setAudioDragging(false)}
            onDrop={handleAudioDrop}
          >
            <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: "none" }}
              onChange={(e) => handleAudioChange(e.target.files?.[0] ?? null)} />
            {audioFile ? (
              <>
                <span style={{ fontSize: "28px" }}>🎵</span>
                <span style={{ color: "#1DB954", fontWeight: 700, fontSize: "13px", textAlign: "center" }}>
                  {audioFile.name}
                </span>
                <span style={{ color: "#b3b3b3", fontSize: "11px" }}>
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: "32px" }}>🎧</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>
                  Kéo thả hoặc click để chọn file audio
                </span>
                <span style={{ color: "#b3b3b3", fontSize: "12px" }}>MP3, MP4...</span>
              </>
            )}
          </div>

          {/* Thumbnail + right fields */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            {/* Thumbnail */}
            <div
              style={{
                ...thumbBoxStyle,
                backgroundImage: thumbPreview ? `url(${thumbPreview})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => thumbInputRef.current?.click()}
              title="Chọn ảnh bìa"
            >
              <input ref={thumbInputRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={handleThumbChange} />
              {!thumbPreview && (
                <div style={{ textAlign: "center", color: "#b3b3b3" }}>
                  <div style={{ fontSize: "24px" }}>🖼️</div>
                  <div style={{ fontSize: "11px", marginTop: "4px" }}>Ảnh bìa</div>
                </div>
              )}
              {thumbPreview && <div style={thumbOverlayStyle}>✎</div>}
            </div>

            {/* Right fields */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <Field label="Tên bài hát *">
                <input name="title" value={form.title} onChange={handleFormChange}
                  placeholder="Nhập tên bài hát" style={inputStyle} />
              </Field>

              {/* Artist searchable dropdown */}
              <Field label="Nghệ sĩ *">
                <div ref={artistDropdownRef} style={{ position: "relative" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      value={artistSearch}
                      onChange={(e) => {
                        setArtistSearch(e.target.value);
                        setSelectedArtist(null);
                        setArtistDropdownOpen(true);
                      }}
                      onFocus={() => setArtistDropdownOpen(true)}
                      placeholder="Tìm nghệ sĩ..."
                      style={{
                        ...inputStyle,
                        paddingRight: selectedArtist ? "36px" : "12px",
                        border: selectedArtist ? "1px solid #1DB954" : "1px solid transparent",
                      }}
                    />
                    {/* Clear button */}
                    {selectedArtist && (
                      <button
                        onClick={handleClearArtist}
                        style={{
                          position: "absolute", right: "10px", top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent", border: "none",
                          color: "#b3b3b3", cursor: "pointer", fontSize: "14px", padding: 0,
                        }}
                      >✕</button>
                    )}
                  </div>

                  {/* Selected badge */}
                  {selectedArtist && (
                    <div style={{
                      marginTop: "6px", display: "flex", alignItems: "center", gap: "8px",
                      background: "#1a2e1a", borderRadius: "8px", padding: "6px 10px",
                    }}>
                      {selectedArtist.artistImage ? (
                        <img
                          src={`http://localhost:5081/media/images/artist/${selectedArtist.artistImage}`}
                          alt={selectedArtist.artistName}
                          style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : <span>🎤</span>}
                      <span style={{ color: "#1DB954", fontSize: "13px", fontWeight: 700 }}>
                        {selectedArtist.artistName}
                      </span>
                      <span style={{ color: "#b3b3b3", fontSize: "11px", marginLeft: "auto" }}>
                        ID: {selectedArtist.artistID}
                      </span>
                    </div>
                  )}

                  {/* Dropdown list */}
                  {artistDropdownOpen && !selectedArtist && (
                    <div style={dropdownStyle}>
                      {artistLoading ? (
                        <div style={dropdownItemBaseStyle}>
                          <span style={{ color: "#b3b3b3", fontSize: "13px" }}>Đang tải...</span>
                        </div>
                      ) : artistResults.length === 0 ? (
                        <div style={dropdownItemBaseStyle}>
                          <span style={{ color: "#b3b3b3", fontSize: "13px" }}>
                            Không tìm thấy nghệ sĩ nào
                          </span>
                        </div>
                      ) : artistResults.map((artist) => (
                        <ArtistOption
                          key={artist.artistID}
                          artist={artist}
                          onSelect={handleSelectArtist}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Album (không bắt buộc)">
                <div ref={albumDropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => {
                      if (!selectedArtist) return;
                      setAlbumDropdownOpen((prev) => !prev);
                    }}
                    style={{
                      ...inputStyle,
                      textAlign: "left",
                      cursor: selectedArtist ? "pointer" : "not-allowed",
                      opacity: selectedArtist ? 1 : 0.5,
                      border: selectedAlbum ? "1px solid #1DB954" : "1px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span style={{ color: selectedAlbum ? "#fff" : "#666", fontSize: "13px",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {!selectedArtist ? "Chọn nghệ sĩ trước"
                        : selectedAlbum ? selectedAlbum.albumName
                        : "Chọn album..."}
                    </span>
                    <span style={{ color: "#b3b3b3", fontSize: "11px", flexShrink: 0 }}>▾</span>
                  </button>

                  {selectedAlbum && (
                    <button
                      onClick={() => { setSelectedAlbum(null); setForm((p) => ({ ...p, albumID: "" })); }}
                      style={{ position: "absolute", right: "28px", top: "50%", transform: "translateY(-50%)",
                        background: "transparent", border: "none", color: "#b3b3b3",
                        cursor: "pointer", fontSize: "12px", padding: 0 }}
                    >✕</button>
                  )}

                  {albumDropdownOpen && selectedArtist && (
                    <div style={dropdownStyle}>
                      {albumLoading ? (
                        <div style={dropdownItemBaseStyle}>
                          <span style={{ color: "#b3b3b3", fontSize: "13px" }}>Đang tải...</span>
                        </div>
                      ) : albumResults.length === 0 ? (
                        <div style={dropdownItemBaseStyle}>
                          <span style={{ color: "#b3b3b3", fontSize: "13px" }}>
                            Nghệ sĩ này chưa có album nào
                          </span>
                        </div>
                      ) : albumResults.map((album) => (
                        <AlbumOption
                          key={album.albumID}
                          album={album}
                          onSelect={(a) => {
                            setSelectedAlbum(a);
                            setForm((p) => ({ ...p, albumID: String(a.albumID) }));
                            setAlbumDropdownOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Field>
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Field label="Thể loại (Tag)" style={{ flex: 1 }}>
              <input name="mediaItemTag" value={form.mediaItemTag} onChange={handleFormChange}
                placeholder="VD: V-Pop, Rap..." style={inputStyle} />
            </Field>
            <Field label="Loại media" style={{ flex: 1 }}>
              <select name="mediaItemType" value={form.mediaItemType} onChange={handleFormChange} style={selectStyle}>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </Field>
            <Field label="Thời lượng (giây)" style={{ flex: 1 }}>
              <input name="duration" value={form.duration} onChange={handleFormChange}
                placeholder="VD: 215" type="number" style={inputStyle} />
            </Field>
          </div>

          <Field label="Mô tả">
            <textarea name="description" value={form.description} onChange={handleFormChange}
              placeholder="Mô tả bài hát (không bắt buộc)" rows={2}
              style={{ ...inputStyle, resize: "vertical", minHeight: "56px" }} />
          </Field>

          {error && (
            <div style={{ color: "#ff4d4d", fontSize: "13px", background: "#2a1414", borderRadius: "8px", padding: "10px 12px" }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ color: "#1DB954", fontSize: "13px", background: "#162316", borderRadius: "8px", padding: "10px 12px" }}>
              ✅ Upload thành công!
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button style={cancelBtnStyle} onClick={handleClose} disabled={loading}>Huỷ</button>
          <button
            style={{ ...submitBtnStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang upload..." : "⬆️ Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Artist dropdown option với hover state
const AlbumOption = ({ album, onSelect }: { album: Album; onSelect: (a: Album) => void }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(album)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...dropdownItemBaseStyle,
        background: hovered ? "#2a2a2a" : "transparent",
        cursor: "pointer",
      }}
    >
      {album.albumItemImage ? (
        <img
          src={`http://localhost:5081/media/images/album/${album.albumItemImage}`}
          alt={album.albumName}
          style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }}
        />
      ) : (
        <div style={{
          width: "32px", height: "32px", borderRadius: "6px", background: "#3a3a3a",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0,
        }}>💿</div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: "13px", fontWeight: 700,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {album.albumName}
        </div>
        <div style={{ color: "#b3b3b3", fontSize: "11px" }}>ID: {album.albumID}</div>
      </div>
    </div>
  );
};

const ArtistOption = ({ artist, onSelect }: { artist: Artist; onSelect: (a: Artist) => void }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(artist)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...dropdownItemBaseStyle,
        background: hovered ? "#2a2a2a" : "transparent",
        cursor: "pointer",
      }}
    >
      {artist.artistImage ? (
        <img
          src={`http://localhost:5081/media/images/artist/${artist.artistImage}`}
          alt={artist.artistName}
          style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
      ) : (
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%", background: "#3a3a3a",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0,
        }}>🎤</div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: "13px", fontWeight: 700,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {artist.artistName}
        </div>
        <div style={{ color: "#b3b3b3", fontSize: "11px" }}>ID: {artist.artistID}</div>
      </div>
    </div>
  );
};

const Field = ({ label, children, style }: {
  label: string; children: React.ReactNode; style?: CSSProperties;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "5px", ...style }}>
    <label style={{ color: "#b3b3b3", fontSize: "12px", fontWeight: 600 }}>{label}</label>
    {children}
  </div>
);

// Styles
const overlayStyle: CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
};
const modalStyle: CSSProperties = {
  background: "#181818", borderRadius: "16px", width: "100%", maxWidth: "560px",
  maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden",
  boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
};
const headerStyle: CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "20px 24px 16px", borderBottom: "1px solid #2a2a2a",
};
const closeBtnStyle: CSSProperties = {
  width: "32px", height: "32px", borderRadius: "50%", border: "none",
  background: "#2a2a2a", color: "#fff", cursor: "pointer", fontSize: "14px",
  display: "flex", alignItems: "center", justifyContent: "center",
};
const bodyStyle: CSSProperties = {
  flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex",
  flexDirection: "column", gap: "14px", scrollbarWidth: "thin", scrollbarColor: "#555 transparent",
};
const footerStyle: CSSProperties = {
  padding: "16px 24px", borderTop: "1px solid #2a2a2a",
  display: "flex", justifyContent: "flex-end", gap: "10px",
};
const dropZoneStyle: CSSProperties = {
  border: "2px dashed #3a3a3a", borderRadius: "12px", padding: "24px 16px",
  display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
  cursor: "pointer", transition: "all 0.2s ease",
};
const thumbBoxStyle: CSSProperties = {
  width: "100px", height: "100px", minWidth: "100px", borderRadius: "10px",
  background: "#2a2a2a", cursor: "pointer", display: "flex", alignItems: "center",
  justifyContent: "center", overflow: "hidden", position: "relative",
  flexShrink: 0, border: "2px dashed #3a3a3a",
};
const thumbOverlayStyle: CSSProperties = {
  position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#fff", fontSize: "20px", opacity: 0, transition: "opacity 0.2s",
};
const inputStyle: CSSProperties = {
  background: "#2a2a2a", border: "none", outline: "none", borderRadius: "8px",
  padding: "10px 12px", color: "#fff", fontSize: "13px", width: "100%", boxSizing: "border-box",
};
const selectStyle: CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "none" };
const cancelBtnStyle: CSSProperties = {
  background: "transparent", border: "1px solid #3a3a3a", color: "#fff",
  borderRadius: "999px", padding: "10px 20px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
};
const submitBtnStyle: CSSProperties = {
  background: "#1DB954", border: "none", color: "#000", borderRadius: "999px",
  padding: "10px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer",
};
const dropdownStyle: CSSProperties = {
  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
  background: "#282828", borderRadius: "10px", zIndex: 9999,
  boxShadow: "0 8px 24px rgba(0,0,0,0.6)", maxHeight: "200px",
  overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#555 transparent",
};
const dropdownItemBaseStyle: CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
  padding: "10px 12px", borderRadius: "6px", transition: "background 0.15s",
};

export default UploadMediaModal;