type SectionHeaderProps = {
  label?: string;
  title: string;
  actionText?: string; // NEW
  onShowAll?: () => void;
};
const SectionHeader = ({
  label,
  title,
  actionText = "Hiện tất cả",
  onShowAll,
}: SectionHeaderProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: label ? "flex-start" : "center",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}
    >
      <div>
        {label && (
          <p
            style={{
              color: "#b3b3b3",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "2px",
            }}
          >
            {label}
          </p>
        )}

        <h2
          style={{
            color: "#fff",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          {title}
        </h2>
      </div>

      {onShowAll && (
        <button
          onClick={onShowAll}
          style={{
            background: "none",
            border: "none",
            color: "#b3b3b3",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
