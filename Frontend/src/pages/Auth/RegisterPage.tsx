import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "./components/AuthCard";
import AuthInput from "./components/AuthInput";
import AuthButton from "./components/AuthButton";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {setLoading, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // NEW: báo lỗi đăng ký
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phone.trim()
    ) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      await authApi.register({
        username,
        email,
        password,
        phone,
      });

      navigate("/login", {
        state: { message: "Đăng ký thành công! Vui lòng đăng nhập." },
      });
    } catch (error: unknown) {
      console.error("REGISTER ERROR:", error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          error.response?.data?.error ??
          "Đăng ký thất bại.";

        setError(message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "8px" }}>
        Tạo tài khoản
      </h1>

      <p
        style={{ color: "#b3b3b3", textAlign: "center", marginBottom: "28px" }}
      >
        Tham gia TuneVault ngay 🎵
      </p>

      {error && (
        <p
          style={{
            color: "#ff4d4f",
            background: "rgba(255,77,79,0.1)",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Tên người dùng"
          value={username}
          onChange={setUsername}
          placeholder="Nhập tên người dùng"
        />
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
        {/* NEW: thêm input số điện thoại */}
        <AuthInput
          label="Số điện thoại"
          value={phone}
          onChange={setPhone}
          placeholder="Nhập số điện thoại"
        />
        <AuthButton loading={isLoading}>Đăng ký</AuthButton>
      </form>

      <p style={{ color: "#b3b3b3", textAlign: "center", marginTop: "22px" }}>
        Đã có tài khoản?{" "}
        <Link to="/login" style={{ color: "#1DB954", fontWeight: 700 }}>
          Đăng nhập
        </Link>
      </p>
    </AuthCard>
  );
};

export default RegisterPage;
