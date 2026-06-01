import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      login(res.token, res.user);
      navigate("/");
    } catch {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#121212",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#181818",
          borderRadius: "12px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <svg width="50" height="50" viewBox="0 0 24 24" fill="#f118f9">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>

        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, margin: 0 }}>
          Đăng nhập vào TuneVault
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              style={{
                background: "#2a2a2a",
                border: "1px solid #3a3a3a",
                borderRadius: "6px",
                padding: "12px 16px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#fff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#3a3a3a")}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
              style={{
                background: "#2a2a2a",
                border: "1px solid #3a3a3a",
                borderRadius: "6px",
                padding: "12px 16px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#fff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#3a3a3a")}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                color: "#e91429",
                fontSize: "13px",
                background: "#2a1a1a",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid #3a1a1a",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#158a3e" : "#1DB954",
              color: "#000",
              border: "none",
              borderRadius: "500px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.1s",
              marginTop: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#1ed760";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "#1DB954";
            }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#3a3a3a" }} />
          <span style={{ color: "#b3b3b3", fontSize: "12px" }}>hoặc</span>
          <div style={{ flex: 1, height: "1px", background: "#3a3a3a" }} />
        </div>

        {/* Register link */}
        <p style={{ color: "#b3b3b3", fontSize: "14px", margin: 0 }}>
          Chưa có tài khoản?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;