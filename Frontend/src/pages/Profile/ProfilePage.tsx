import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";

interface ProfileUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  playlistCount?: number;
  followingCount?: number;
}

interface FollowingUser {
  id: string | number;
  name: string;
  role?: string;
  avatarUrl?: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [following, setFollowing] = useState<FollowingUser[]>([]);

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(false);

        const [profileRes, followingRes] = await Promise.all([
          userApi.getProfile(),
          userApi.getFollowing(),
        ]);

        setProfile(profileRes.data);
        setFollowing(followingRes.data);

        setDisplayName(profileRes.data.username ?? "");
        setAvatarUrl(profileRes.data.avatarUrl ?? "");
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const res = await userApi.updateProfile({
        username: displayName,
        avatarUrl,
      });

      setProfile(res.data);
      setDisplayName(res.data.username ?? "");
      setAvatarUrl(res.data.avatarUrl ?? "");
      setIsEditing(false);
    } catch {
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

  if (error) {
    return (
      <main style={pageStyle}>
        <div style={{ padding: "32px", color: "#ff4d4f" }}>
          Không thể tải hồ sơ từ backend.
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
            <h1 style={titleStyle}>{profile?.username}</h1>
          )}

          <div style={{ color: "#b3b3b3", fontSize: "14px" }}>
            {profile?.email} • {profile?.playlistCount ?? 0} danh sách phát •{" "}
            {profile?.followingCount ?? following.length} đang theo dõi
          </div>
        </div>
      </section>

      <section style={{ padding: "28px 32px 60px" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
          {isEditing ? (
            <>
              <button onClick={handleSaveProfile} style={buttonPrimaryStyle}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>

              <button
                onClick={() => {
                  setDisplayName(profile?.username ?? "");
                  setAvatarUrl(profile?.avatarUrl ?? "");
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
              Đổi ảnh đại diện
            </h2>

            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Dán URL ảnh avatar..."
              style={inputStyle}
            />
          </div>
        )}

        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
          Thông tin cá nhân
        </h2>

        <div style={cardStyle}>
          <InfoRow label="Tên người dùng" value={profile?.username ?? ""} />
          <InfoRow label="Email" value={profile?.email ?? ""} />
          <InfoRow label="Trạng thái" value="Đã kết nối backend" />
        </div>

        <h2 style={{ fontSize: "24px", margin: "36px 0 18px" }}>
          Đang theo dõi
        </h2>

        {following.length === 0 ? (
          <p style={{ color: "#b3b3b3" }}>
            Chưa có dữ liệu theo dõi từ backend.
          </p>
        ) : (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {following.map((person) => (
              <div key={person.id} style={followCardStyle}>
                <div style={followAvatarStyle}>
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl}
                      alt={person.name}
                      style={avatarImgStyle}
                    />
                  ) : (
                    person.name.charAt(0)
                  )}
                </div>

                <div style={followNameStyle}>{person.name}</div>

                <div style={{ color: "#b3b3b3", fontSize: "13px" }}>
                  {person.role ?? "Người dùng"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div style={infoRowStyle}>
    <span style={{ color: "#b3b3b3" }}>{label}</span>
    <span style={{ fontWeight: 600 }}>{value}</span>
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
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#282828",
  border: "1px solid #444",
  borderRadius: "8px",
  color: "#fff",
  padding: "12px",
  outline: "none",
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

const followCardStyle: React.CSSProperties = {
  width: "140px",
  background: "#181818",
  borderRadius: "12px",
  padding: "16px",
  cursor: "pointer",
};

const followAvatarStyle: React.CSSProperties = {
  width: "108px",
  height: "108px",
  borderRadius: "50%",
  background: "#333",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "36px",
  overflow: "hidden",
};

const followNameStyle: React.CSSProperties = {
  fontWeight: 700,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default ProfilePage;