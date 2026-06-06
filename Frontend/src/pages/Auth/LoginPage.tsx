import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "./components/AuthCard";
import AuthInput from "./components/AuthInput";
import AuthButton from "./components/AuthButton";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // NEW: gọi backend thật
      const res = await authApi.login(email, password);

      login(res.data.user, res.data.accessToken);
      navigate("/");
    } catch {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "8px" }}>
        TuneVault
      </h1>

      <p
        style={{ color: "#b3b3b3", textAlign: "center", marginBottom: "28px" }}
      >
        Đăng nhập để nghe nhạc 🎧
      </p>

      {error && <p style={{ color: "#ff4d4f" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Nhập email"
        />

        <AuthInput
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Nhập mật khẩu"
        />

        <AuthButton loading={isLoading}>Đăng nhập</AuthButton>
      </form>

      <p style={{ color: "#b3b3b3", textAlign: "center", marginTop: "22px" }}>
        Chưa có tài khoản?{" "}
        <Link to="/register" style={{ color: "#1DB954", fontWeight: 700 }}>
          Đăng ký
        </Link>
      </p>
    </AuthCard>
  );
};

export default LoginPage;
