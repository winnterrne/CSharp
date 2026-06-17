import { useState } from "react";
import type { Media } from "../../types/media";
import { authStore } from "../../store/authStore";
import { userApi } from "../../api/userApi";
import type { UserProfile } from "../../types/profile";
import { useEffect } from "react";
import { useHistoryStore } from "../../store/historyStore";
import { PlayIcon } from "../common/icons";
export interface HeaderUser {
  displayName: string;
  avatarUrl?: string;
  avatarColor?: string;
}

export interface HeaderProps {
  searchValue: string;
  searchResults: Media[];
  searchLoading: boolean;
  searchError: string | null;
  user?: HeaderUser | null;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onHomeClick: () => void;
  onBrowseClick?: () => void;
  onNotificationClick?: () => void;
  onFriendsClick?: () => void;
  onAvatarClick?: () => void;
  onPlayTrack?: (track: Media) => void;
  onSelectTrack?: (track: Media) => void;
}

// Thêm helper format ngày
const formatPlayedAt = (playedAt?: string) => {
  if (!playedAt) return "";
  const date = new Date(playedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};


const Header = ({
  searchValue,
  searchResults,
  searchLoading,
  searchError,
  user,
  onSearch,
  onSearchChange,
  onHomeClick,
  onNotificationClick,
  onFriendsClick,
  onAvatarClick,
  onPlayTrack,
  onSelectTrack,
}: HeaderProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const avatarInitial = user?.displayName?.charAt(0).toUpperCase() ?? "?";
  const avatarBg = user?.avatarColor ?? "#e91429";
  const showDropdown = searchFocused && searchValue.trim().length > 0;

  const authUser = authStore((state) => state.user);
  const logout = authStore((state) => state.logout);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showRecentModal, setShowRecentModal] = useState(false);
  const recentTracks = useHistoryStore((state) => state.recentTracks);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!authUser?.id) return;

        const res = await userApi.getProfile(authUser.id);

        setProfile(res.data.data);
      } catch (error) {
        console.error("LOAD PROFILE ERROR:", error);
      }
    };

    loadProfile();
  }, [authUser?.id]);

  return (
    <header
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #121212 100%)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        minHeight: "64px",
        fontFamily:
          "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ flexShrink: 0 }}>
        <svg width="50" height="40" viewBox="0 0 20 24" fill="#f118f9">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </div>

      {/* Center: Home + Search */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          maxWidth: "560px",
        }}
      >
        {/* Home Button */}
        <button
          onClick={onHomeClick}
          title="Trang chủ"
          style={{
            background: "#2a2a2a",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "transform 0.1s ease, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "#ff00f7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#aa1389";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
          </svg>
        </button>

        {/* Search Wrapper */}
        <div style={{ position: "relative", flex: 1 }}>
          {/* Search Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#3a3a3a",
              borderRadius: "500px",
              padding: "10px 16px",
              border: `1px solid ${searchFocused ? "#fff" : "transparent"}`,
              transition: "border-color 0.2s",
            }}
          >
            <button
              onClick={onSearch}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <svg
                role="img"
                height="24"
                width="24"
                viewBox="0 0 24 24"
                fill="#b3b3b3"
              >
                <path d="M10.5 3a7.5 7.5 0 1 0 4.74 13.32l4.22 4.22a1 1 0 0 0 1.42-1.42l-4.22-4.22A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Z" />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Bạn muốn phát nội dung gì?"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "14px",
                width: "100%",
                caretColor: "#1DB954",
              }}
            />
          </div>

          {/* Search Dropdown */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "52px",
                left: 0,
                width: "100%",
                background: "#282828",
                borderRadius: "12px",
                padding: "8px",
                zIndex: 999,
                boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                maxHeight: "420px",
                overflowY: "auto",
              }}
            >
              {searchLoading && (
                <div style={{ padding: "12px", color: "#b3b3b3" }}>
                  Đang tìm kiếm...
                </div>
              )}

              {searchError && (
                <div style={{ padding: "12px", color: "#ff4d4f" }}>
                  Có lỗi xảy ra
                </div>
              )}

              {!searchLoading && !searchError && searchResults.length === 0 && (
                <div style={{ padding: "12px", color: "#b3b3b3" }}>
                  Không tìm thấy kết quả
                </div>
              )}

              {!searchLoading &&
                !searchError &&
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onPlayTrack?.(item);
                      onSelectTrack?.(item);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#3a3a3a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                      }}
                    >
                      {item.thumbnailUrl ?
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      : "🎵"}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: "#b3b3b3",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.type === "video" ? "Video" : "Bài hát"} • {item.artist.name}
                      </div>
                    </div>

                    {/* Play button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                          onPlayTrack?.(item);
                          onSelectTrack?.(item);
                      }}
                      title="Phát"
                      style={{
                        background: "#1DB954",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        color: "#000",
                        cursor: "pointer",
                        fontWeight: "bold",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PlayIcon/>
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <IconActionBtn title="Thông báo" onClick={onNotificationClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </IconActionBtn>

        <IconActionBtn title="Bạn bè" onClick={onFriendsClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </IconActionBtn>

        {/* Avatar + Account Menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            title={user?.displayName ?? "Tài khoản"}
            style={{
              background: avatarBg,
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              transition: "transform 0.1s ease",
              padding: 0,
              overflow: "hidden",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.08)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {user?.avatarUrl ?
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            : avatarInitial}
          </button>

          {showAccountMenu && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                width: "220px",
                background: "#282828",
                borderRadius: "8px",
                padding: "4px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                zIndex: 9999,
              }}
            >
              <MenuItem
                label="Hồ sơ"
                onClick={() => {
                  setShowAccountMenu(false);
                  onAvatarClick?.();
                }}
              />
              <MenuItem
                label="Gần đây"
                onClick={() => {
                  setShowAccountMenu(false);
                  setShowRecentModal(true);
                }}
              />
              <div
                style={{
                  height: "1px",
                  background: "#3e3e3e",
                  margin: "4px 0",
                }}
              />
              <MenuItem
                label="Đăng xuất"
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
              />
            </div>
          )}
        </div>
      </div>
      {showProfileModal && profile && (
        <div
          onClick={() => setShowProfileModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.7)",
            zIndex: 99999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "500px",
              background: "#181818",
              borderRadius: "16px",
              padding: "24px",
              color: "#fff",
            }}
          >
            <h2
              style={{
                marginBottom: "24px",
              }}
            >
              Hồ sơ cá nhân
            </h2>

            <ProfileRow label="Tên" value={profile.userName} />

            <ProfileRow label="Email" value={profile.email} />

            <ProfileRow label="Vai trò" value={profile.role} />

            <ProfileRow
              label="Số điện thoại"
              value={profile.phone ?? "Chưa cập nhật"}
            />

            <button
              onClick={() => setShowProfileModal(false)}
              style={{
                marginTop: "24px",
                width: "100%",
                height: "42px",
                border: "none",
                borderRadius: "999px",
                background: "#1DB954",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showRecentModal && (
        <div
          onClick={() => setShowRecentModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.65)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "480px",
              maxWidth: "100%",
              background: "#181818",
              borderRadius: "14px",
              padding: "24px",
              color: "#fff",
              maxHeight: "70vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2 style={{ margin: "0 0 16px", fontSize: "22px" }}>Gần đây</h2>

            {recentTracks.length === 0 ? (
              <p style={{ color: "#b3b3b3" }}>Chưa có bài hát nào gần đây.</p>
            ) : (
              <div style={{ overflowY: "auto", flex: 1 }}>
                {recentTracks.map((track) => (
                  <RecentTrackRow
                    key={track.id}
                    track={track}
                    onPlay={(t) => {
                      onPlayTrack?.(t);
                      setShowRecentModal(false);
                    }}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setShowRecentModal(false)}
              style={{
                marginTop: "16px",
                width: "100%",
                height: "40px",
                border: "none",
                borderRadius: "999px",
                background: "#333",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
        )}
      </header>
    );
  };

  // ─── Sub-components ────────────────────────────────────────────────────────────
  const IconActionBtn = ({
    children,
    title,
    onClick,
  }: {
    children: React.ReactNode;
    title?: string;
    onClick?: () => void;
  }) => (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#b3b3b3",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#b3b3b3")}
    >
      {children}
    </button>
  );

  const MenuItem = ({
    label,
    onClick,
  }: {
    label: string;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        color: "#fff",
        padding: "12px",
        textAlign: "left",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 600,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#3e3e3e")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </button>
  );
  const ProfileRow = ({ label, value }: { label: string; value: string }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #2f2f2f",
      }}
    >
      <span
        style={{
          color: "#b3b3b3",
        }}
      >
        {label}
      </span>

      <span>{value}</span>
    </div>
  );

  const RecentTrackRow = ({
      track,
      onPlay,
    }: {
      track: Media;
    onPlay: (track: Media) => void;
  }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 8px",
          borderRadius: "8px",
          background: hovered ? "#2a2a2a" : "transparent",
          cursor: "pointer",
        }}
      >
        <div style={{
          width: "44px", height: "44px", borderRadius: "6px",
          overflow: "hidden", flexShrink: 0, background: "#282828",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#b3b3b3",
        }}>
          {track.thumbnailUrl ? (
            <img src={track.thumbnailUrl} alt={track.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : "🎵"}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            color: "#fff", fontWeight: 700, fontSize: "14px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {track.title}
          </div>
          <div style={{ color: "#b3b3b3", fontSize: "13px", marginTop: "3px", display: "flex", gap: "8px" }}>
            <span>{track.artist?.name ?? "Unknown Artist"}</span>
            {track.playedAt && <><span>•</span><span>{formatPlayedAt(track.playedAt)}</span></>}
          </div>
        </div>

        {/* Nút play hiện khi hover row */}
        <button
          onClick={() => onPlay(track)}
          title="Phát"
          style={{
            width: "36px", height: "36px", borderRadius: "50%",
            border: "none", background: "#1DB954", color: "#000",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
            opacity: hovered ? 1 : 0,
            transition: "opacity .15s",
          }}
        >
          <PlayIcon />
        </button>
      </div>
    );
  };
export default Header;
