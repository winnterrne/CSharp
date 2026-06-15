import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { authStore } from "../../store/authStore";

interface UserProfileDto {
  userID: string;
  userName: string;
  userImage?: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
}

const baseUrl = "http://localhost:5081";

const ProfilePage = () => {
  const authUser = authStore((state) => state.user);
  const setUser = authStore((state) => state.setUser);

  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        if (!authUser?.id) {
          setError("Không tìm thấy user id. Vui lòng đăng nhập lại.");
          return;
        }

        const res = await userApi.getProfile(authUser.id);
        const data = res.data?.data as UserProfileDto;

        setProfile(data);
        setDisplayName(data.userName ?? "");
        setAvatarUrl( data.userImage ? `${baseUrl}/media/images/users/${data.userImage}`: "");
        setPhone(data.phone ?? "");
      } catch (err) {
        console.error("LOAD PROFILE ERROR:", err);
        setError("Không thể tải hồ sơ từ backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?.id]);

  const handleSaveProfile = async () => {
    try {
      if (!authUser?.id) return;

      setSaving(true);

      const res = await userApi.updateProfile(authUser.id, {
        userName: displayName,
        userImage: avatarUrl,
        phone,
        bio,
      });

      const data = res.data?.data as UserProfileDto;

      setProfile(data);
      setDisplayName(data.userName ?? "");
      setAvatarUrl(data.userImage ?? "");
      setPhone(data.phone ?? "");
      setBio(data.bio ?? "");

      setUser({
        id: data.userID,
        username: data.userName,
        email: data.email,
        role: data.role,
        avatarUrl: data.userImage,
        phone: data.phone,
        bio: data.bio,
      });

      setIsEditing(false);
    } catch (err) {
      console.error("SAVE PROFILE ERROR:", err);
      alert("Cập nhật hồ sơ thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={{ padding: "32px", color: "#b3b3b3" }}>
          Đang tải hồ sơ...
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main style={pageStyle}>
        <div style={{ padding: "32px", color: "#ff7676" }}>
          {error || "Không tìm thấy hồ sơ."}
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={avatarBoxStyle}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} style={avatarImgStyle} />
          ) : (
            <span style={{ fontSize: "64px", color: "#b3b3b3" }}>👤</span>
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 700 }}>Hồ sơ</div>

          {isEditing ? (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={nameInputStyle}
            />
          ) : (
            <h1 style={titleStyle}>{profile.userName}</h1>
          )}

          <div style={{ color: "#b3b3b3", fontSize: "14px" }}>
            {profile.email} • {profile.role}
          </div>
        </div>
      </section>

      <section style={{ padding: "28px 32px 60px",
                       maxWidth : "700px",
                       margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
          {isEditing ? (
            <>
              <button onClick={handleSaveProfile} style={buttonPrimaryStyle}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>

              <button
                onClick={() => {
                  setDisplayName(profile.userName ?? "");
                  setAvatarUrl(profile.userImage ?? "");
                  setPhone(profile.phone ?? "");
                  setIsEditing(false);
                }}
                style={buttonSecondaryStyle}
              >
                Hủy
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} style={buttonPrimaryStyle}>
              Chỉnh sửa hồ sơ
            </button>
          )}
        </div>

        {isEditing && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
              Chỉnh sửa thông tin
            </h2>

            <label style={labelStyle}>Tên người dùng</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tên người dùng"
              style={inputStyle}
            />

            <label style={labelStyle}>Ảnh đại diện</label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Dán URL ảnh avatar..."
              style={inputStyle}
            />

            <label style={labelStyle}>Số điện thoại</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
              style={inputStyle}
            />

            <label style={labelStyle}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Giới thiệu bản thân..."
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>
        )}

        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
          Thông tin cá nhân
        </h2>

        <div style={cardStyle}>
          <InfoRow label="User ID" value={profile.userID} />
          <InfoRow label="Tên người dùng" value={profile.userName} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Vai trò" value={profile.role} />
          <InfoRow label="Số điện thoại" value={profile.phone ?? "Chưa cập nhật"} />
          <div
            style={{
              padding: "16px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                color: "#b3b3b3",
                marginBottom: "10px",
                fontWeight: 500,
              }}
            >
              Bio
            </div>

            <div
              style={{
                background: "#181818",
                padding: "14px",
                borderRadius: "8px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {profile.bio ?? "No bio yet"}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div style={infoRowStyle}>
    <span style={{ color: "#b3b3b3" }}>{label}</span>
    <span style={{ fontWeight: 600, textAlign: "right" }}>{value}</span>
  </div>
);


const pageStyle: React.CSSProperties = {
  flex: 1,
  width: "100%",
  height: "100%",
  color: "#fff",
  background: "#121212",
  overflowY: "auto",
  overflowX: "hidden",
};

const heroStyle: React.CSSProperties = {
  minHeight: "230px",
  padding: "48px 32px 28px",
  display: "flex",
  alignItems: "flex-end",
  gap: "24px",
  background:
    "linear-gradient(180deg, #4a4a4a 0%, #242424 55%, #121212 100%)",
};

const avatarBoxStyle: React.CSSProperties = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  background: "#282828",
  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  flexShrink: 0,
};

const avatarImgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(40px, 7vw, 72px)",
  lineHeight: 1,
  margin: "10px 0",
  fontWeight: 900,
  letterSpacing: "-0.04em",
};

const nameInputStyle: React.CSSProperties = {
  margin: "10px 0",
  width: "100%",
  maxWidth: "520px",
  background: "#282828",
  border: "1px solid #555",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "42px",
  fontWeight: 900,
  padding: "8px 12px",
  outline: "none",
};

const cardStyle: React.CSSProperties = {
  background: "#181818",
  borderRadius: "12px",
  padding: "16px 20px",
  maxWidth: "720px",
  marginBottom: "32px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#b3b3b3",
  fontSize: "13px",
  fontWeight: 700,
  margin: "14px 0 8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#282828",
  border: "1px solid #444",
  borderRadius: "8px",
  color: "#fff",
  padding: "12px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonPrimaryStyle: React.CSSProperties = {
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: "999px",
  padding: "10px 20px",
  fontWeight: 800,
  cursor: "pointer",
};

const buttonSecondaryStyle: React.CSSProperties = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #555",
  borderRadius: "999px",
  padding: "10px 20px",
  fontWeight: 800,
  cursor: "pointer",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #2a2a2a",
  gap: "16px",
};

export default ProfilePage;