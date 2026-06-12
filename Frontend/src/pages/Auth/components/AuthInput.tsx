interface AuthInputProps {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const AuthInput = ({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}: AuthInputProps) => {
  return (
    <label style={{ display: "block", marginBottom: "16px" }}>
      <span
        style={{
          display: "block",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "13px 14px",
          borderRadius: "8px",
          border: "1px solid #3a3a3a",
          background: "#121212",
          color: "#fff",
          outline: "none",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
};

export default AuthInput;