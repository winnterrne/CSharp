import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserSearchResult } from "../../api/userApi";

const buildUserImageUrl = (img?: string | null) => {
  if (!img) return "";

  if (img.startsWith("http")) return img;

  if (img.startsWith("/")) return `http://localhost:5081${img}`;

  if (img.includes("/")) return `http://localhost:5081/${img}`;

  return `http://localhost:5081/media/images/users/${img}`;
};

const UserAvatar = ({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string | null;
}) => {
  const [imageError, setImageError] = useState(false);

  const avatarUrl = buildUserImageUrl(userImage);
  const initial = userName?.trim().charAt(0).toUpperCase() || "?";

  if (!avatarUrl || imageError) {
    return (
      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #444, #242424)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 900,
          fontSize: "20px",
        }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={userName}
      onError={() => setImageError(true)}
      style={{
        width: "54px",
        height: "54px",
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
        background: "#333",
      }}
    />
  );
};

const SearchUserCard = ({ user }: { user: UserSearchResult }) => {
  const navigate = useNavigate();

  const userId = user.userID;
  const userName = user.userName ?? "Unknown User";

  return (
    <button
      type="button"
      onClick={() => {
        console.log("CLICK SEARCH USER:", user);

        if (!userId) {
          console.log("USER ID RỖNG");
          return;
        }

        navigate(`/profile/${userId}`);
      }}
      style={{
        width: "100%",
        background: "#181818",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "1px solid #242424",
        cursor: "pointer",
        transition: "background .15s ease, transform .15s ease",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#242424";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#181818";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <UserAvatar userName={userName} userImage={user.userImage} />

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "15px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {userName}
        </div>

        <div
          style={{
            color: "#b3b3b3",
            fontSize: "13px",
            marginTop: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {user.email ?? "Chưa có email"}
        </div>

        <div
          style={{
            color: "#777",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          {user.role ?? "User"}
        </div>
      </div>
    </button>
  );
};

export default SearchUserCard;