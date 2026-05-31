import { useState } from "react";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");

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
        fontFamily: "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Left: Spotify Logo */}
      <div style={{ flexShrink: 0 }}>
        <svg width="50" height="40" viewBox="0 0 20 24" fill="#f118f9">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </div>

      {/* Center: Home + Search Bar */}
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
            e.currentTarget.style.background = "#b01ea9";
          }}
          title="Trang chủ"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
          </svg>
        </button>

      {/* Search Bar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#2a2a2a",
          borderRadius: "500px",
          padding: "10px 16px",
          border: "1px solid transparent",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor = "#fff")
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLDivElement).style.borderColor = "transparent")
        }
      >
        {/* Search Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#b3b3b3"
          style={{ flexShrink: 0 }}
        >
          <path d="M10.533 1.279c-5.18 0-9.407 4.927-9.407 9.688 0 4.96 3.997 8.952 8.906 9.109a.87.87 0 0 1 .209.03l.013.003.012.002a9.78 9.78 0 0 0 1.268.083c5.18 0 9.407-4.127 9.407-8.888 0-4.96-3.997-9.027-8.906-9.027h-1.502zm0 1.8h1.502c3.902 0 7.106 3.3 7.106 7.227 0 3.73-3.104 7.087-7.607 7.087a7.98 7.98 0 0 1-1.032-.068l-.002-.001a.87.87 0 0 1-.209-.03C6.44 17.025 2.926 13.727 2.926 10.967c0-4.07 3.404-7.888 7.607-7.888z" />
          <path d="M21.686 20.333a.9.9 0 0 1-.638-.265l-3.477-3.476a.9.9 0 0 1 1.273-1.273l3.476 3.477a.9.9 0 0 1-.634 1.537z" />
        </svg>

        <input
          type="text"
          placeholder="Bạn muốn phát nội dung gì?"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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

        {/* Divider + Browse icon */}
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "#666",
            flexShrink: 0,
          }}
        />
        <button
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
          title="Duyệt"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#b3b3b3">
            <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h8v-2H3v2zm16 0h2v-2h-2v2zm0-8v2h2V9h-2zm0 4h2v-2h-2v2z" />
          </svg>
        </button>
      </div>
      </div>

      {/* Right: Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >

        {/* Bell */}
        <button
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
          title="Thông báo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </button>

        {/* Friends / Social */}
        <button
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
          title="Bạn bè"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </button>

        {/* Avatar */}
        <button
          style={{
            background: "#e91429",
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
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          title="Tài khoản"
        >
          P
        </button>
      </div>
    </header>
  );
};

export default Header;