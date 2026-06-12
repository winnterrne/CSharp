interface AuthButtonProps {
  children: string;
  loading?: boolean;
}

const AuthButton = ({ children, loading = false }: AuthButtonProps) => {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "999px",
        border: "none",
        background: loading ? "#3a3a3a" : "#1DB954",
        color: "#000",
        fontSize: "15px",
        fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer",
        marginTop: "8px",
      }}
    >
      {loading ? "Đang xử lý..." : children}
    </button>
  );
};

export default AuthButton;