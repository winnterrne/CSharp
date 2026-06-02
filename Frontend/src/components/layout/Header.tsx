import { useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import type { SearchResult } from "../../hooks/useSearch";


export interface HeaderUser {
  displayName: string;
  avatarUrl?: string;
  avatarColor?: string;
}

export interface HeaderProps {
  searchValue: string;

  searchResults: SearchResult[];
  searchLoading: boolean;
  searchError: boolean;

  user?: HeaderUser | null;

  onSearchChange: (value: string) => void;
  onSearch: () => void;

  onHomeClick: () => void;
  onBrowseClick?: () => void;
  onNotificationClick?: () => void;
  onFriendsClick?: () => void;
  onAvatarClick?: () => void;
  onPlayTrack?: (track: SearchResult) => void;
  onSelectTrack?: (track: SearchResult) => void;
}

const Header = ({
  searchValue,
  user,
  onSearch,
  onSearchChange,
  onHomeClick,
  //onBrowseClick,
  onNotificationClick,
  onFriendsClick,
  onAvatarClick,
  onPlayTrack,
  onSelectTrack,
}: HeaderProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { results, loading, error } = useSearch(searchValue);

  const avatarInitial = user?.displayName?.charAt(0).toUpperCase() ?? "?";
  const avatarBg = user?.avatarColor ?? "#e91429";

  const showDropdown = searchValue.trim().length > 0;

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

      {/* Center */}
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
            background: "#aa1389",
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
        <div
          style={{
            position: "relative",
            flex: 1,
          }}
        >
          {/* Search Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#2a2a2a",
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
                justifyContent: "center",
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
              onBlur={() => setSearchFocused(false)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "14px",
                width: "100%",
                caretColor: "#1DB954",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch?.();
                }
              }}
            />

            <div
              style={{
                width: "1px",
                height: "20px",
                background: "#666",
                flexShrink: 0,
              }}
            />

            {/* <button
              onClick={onBrowseClick}
              title="Duyệt"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#b3b3b3">
                <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h8v-2H3v2zm16 0h2v-2h-2v2zm0-8v2h2V9h-2zm0 4h2v-2h-2v2z" />
              </svg>
            </button> */}
          </div>

          {/* Dropdown search */}
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
              {loading && (
                <div style={{ padding: "12px", color: "#b3b3b3" }}>
                  Đang tìm kiếm...
                </div>
              )}

              {error && (
                <div style={{ padding: "12px", color: "#ff4d4f" }}>
                  Có lỗi xảy ra
                </div>
              )}

              {!loading && !error && results.length === 0 && (
                <div style={{ padding: "12px", color: "#b3b3b3" }}>
                  Không tìm thấy kết quả
                </div>
              )}

              {!loading &&
                !error &&
                results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectTrack?.(item);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#3a3a3a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#444",
                      }}
                    >
                      <img
                        src={item.thumbnail || item.coverUrl || item.imageUrl}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

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
                        Bài hát • {item.artist || item.artistName || "Unknown"}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrack?.(item);
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
                      }}
                    >
                      ▶
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
          <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </IconActionBtn>

        <IconActionBtn title="Bạn bè" onClick={onFriendsClick}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </IconActionBtn>

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
            letterSpacing: "0.01em",
            padding: 0,
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
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
      top: "56px",
      right: "24px",
      width: "220px",
      background: "#282828",
      borderRadius: "8px",
      padding: "4px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      zIndex: 9999,
      color: "#fff",
    }}
  >
    <MenuItem
      label="Tài khoản"
      onClick={() => {
        setShowAccountMenu(false);
        onAvatarClick?.();
      }}
    />

    <MenuItem
      label="Hồ sơ"
      onClick={() => {
        setShowAccountMenu(false);
        onAvatarClick?.();
      }}
    />

    <MenuItem label="Gần đây" />

    <MenuItem label="Cài đặt" />

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
        setShowAccountMenu(false);
        console.log("logout");
      }}
    />
  </div>
)}
      </div>
    </header>
  );
};

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
    onMouseEnter={(e) => {
      e.currentTarget.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = "#b3b3b3";
    }}
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
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#3e3e3e";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
    }}
  >
    {label}
  </button>
);

export default Header;
