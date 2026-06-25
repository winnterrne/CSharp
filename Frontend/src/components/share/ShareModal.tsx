import { useEffect, useState } from "react";
import { shareApi } from "../../api/shareApi";
import { userApi, type UserSearchResult } from "../../api/userApi";
import { ShareIcon } from "../common/icons";

type ShareMediaModalProps = {
  open: boolean;
  onClose: () => void;
  mediaItemID?: number | null;
  playlistID?: number | null;
  title?: string;
};

type SafeUserSearchResult = UserSearchResult & {
  userID?: string;
  userId?: string;
  id?: string;

  userName?: string;
  username?: string;
  name?: string;

  email?: string;

  userImage?: string | null;
  avatarUrl?: string | null;
  imageUrl?: string | null;
};

const getUserId = (user: SafeUserSearchResult) => {
  return user.userID ?? user.userId ?? user.id ?? "";
};

const getUserName = (user: SafeUserSearchResult) => {
  return user.userName ?? user.username ?? user.name ?? "Unknown User";
};

const getUserEmail = (user: SafeUserSearchResult) => {
  return user.email ?? "";
};

const getUserImage = (user: SafeUserSearchResult) => {
  return user.userImage ?? user.avatarUrl ?? user.imageUrl ?? "";
};

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
  active,
}: {
  userName: string;
  userImage?: string | null;
  active?: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  const imageUrl = buildUserImageUrl(userImage);
  const initial = userName.trim().charAt(0).toUpperCase() || "?";

  if (!imageUrl || imageError) {
    return (
      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          background: active
            ? "linear-gradient(135deg, #1DB954, #127c38)"
            : "linear-gradient(135deg, #4a4a4a, #242424)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 900,
          fontSize: "18px",
          flexShrink: 0,
          boxShadow: active ? "0 0 0 2px rgba(29,185,84,.35)" : "none",
        }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={userName}
      onError={() => setImageError(true)}
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
        background: "#333",
        boxShadow: active ? "0 0 0 2px rgba(29,185,84,.55)" : "none",
      }}
    />
  );
};

const ShareMediaModal = ({
  open,
  onClose,
  mediaItemID = null,
  playlistID = null,
  title = "Chia sẻ",
}: ShareMediaModalProps) => {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<SafeUserSearchResult[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<SafeUserSearchResult | null>(null);

  const [searching, setSearching] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    const value = keyword.trim();

    if (!value) {
      setUsers([]);
      setSelectedUser(null);
      setMessage("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        setMessage("");

        const res = await userApi.search(value);
        const data = res.data?.data;

        setUsers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("SEARCH USER ERROR:", err);
        console.error("STATUS:", err.response?.status);
        console.error("DATA:", err.response?.data);

        setUsers([]);
        setMessage(err.response?.data?.message || "Không tìm được user");
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword, open]);

  if (!open) return null;

  const handleClose = () => {
    if (sharing) return;

    setKeyword("");
    setUsers([]);
    setSelectedUser(null);
    setMessage("");
    onClose();
  };

  const handleShare = async () => {
    if (!selectedUser) {
      setMessage("Vui lòng chọn người nhận");
      return;
    }

    const receiverID = getUserId(selectedUser);

    if (!receiverID) {
      setMessage("Không lấy được ID người nhận");
      return;
    }

    if (!mediaItemID && !playlistID) {
      setMessage("Không có nội dung để chia sẻ");
      return;
    }

    try {
      setSharing(true);
      setMessage("");

      await shareApi.share({
        receiverID,
        mediaItemID,
        playlistID,
      });

      setMessage("Đã chia sẻ thành công");

      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (err: any) {
      console.error("SHARE ERROR:", err);
      setMessage(err.response?.data?.message || "Không chia sẻ được");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.68)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "560px",
          maxWidth: "100%",
          background: "#181818",
          color: "#fff",
          borderRadius: "18px",
          padding: "26px 28px",
          boxShadow: "0 24px 70px rgba(0,0,0,.6)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: "0 0 18px",
            fontSize: "28px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            lineHeight: 1.15,
          }}
        >
          <ShareIcon />
          {title}
        </h2>

        <p
          style={{
            margin: "0 0 16px",
            color: "#b3b3b3",
            fontSize: "16px",
          }}
        >
          Tìm tên mà bạn muốn chia sẻ.
        </p>

        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setSelectedUser(null);
            setMessage("");
          }}
          placeholder="Nhập tên user..."
          autoFocus
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "999px",
            border: "1px solid #2f2f2f",
            outline: "none",
            padding: "0 20px",
            background: "#242424",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            boxSizing: "border-box",
          }}
        />

        {searching && (
          <div
            style={{
              marginTop: "12px",
              color: "#b3b3b3",
              fontSize: "14px",
            }}
          >
            Đang tìm user...
          </div>
        )}

        {!searching && keyword.trim() && users.length === 0 && !message && (
          <div
            style={{
              marginTop: "12px",
              color: "#b3b3b3",
              fontSize: "14px",
            }}
          >
            Không có kết quả phù hợp.
          </div>
        )}

        {users.length > 0 && (
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxHeight: "240px",
              overflowY: "auto",
              paddingRight: "2px",
            }}
          >
            {users.map((user, index) => {
              const userId = getUserId(user);
              const userName = getUserName(user);
              const userEmail = getUserEmail(user);
              const userImage = getUserImage(user);

              const active = selectedUser
                ? getUserId(selectedUser) === userId
                : false;

              return (
                <button
                  key={userId || index}
                  onClick={() => {
                    setSelectedUser(user);
                    setKeyword(userName);
                    setMessage("");
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = active
                      ? "rgba(29,185,84,.18)"
                      : "#2f2f2f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = active
                      ? "rgba(29,185,84,.14)"
                      : "#242424";
                  }}
                  style={{
                    width: "100%",
                    border: active
                      ? "1px solid #1DB954"
                      : "1px solid #3a3a3a",
                    background: active ? "rgba(29,185,84,.14)" : "#242424",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "left",
                    boxSizing: "border-box",
                  }}
                >
                  <UserAvatar
                    userName={userName}
                    userImage={userImage}
                    active={active}
                  />

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 850,
                        fontSize: "16px",
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
                        fontSize: "14px",
                        marginTop: "3px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {userEmail || "Chưa có email"}
                    </div>
                  </div>

                  {active && (
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#1DB954",
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {selectedUser && (
          <div
            style={{
              marginTop: "12px",
              color: "#1DB954",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Đã chọn: {getUserName(selectedUser)}
          </div>
        )}

        {message && (
          <div
            style={{
              marginTop: "12px",
              color: message.includes("Đã") ? "#1DB954" : "#ff5f5f",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={handleClose}
            disabled={sharing}
            style={{
              height: "44px",
              padding: "0 24px",
              borderRadius: "999px",
              border: "none",
              background: "#333",
              color: "#fff",
              cursor: sharing ? "not-allowed" : "pointer",
              fontWeight: 800,
              fontSize: "15px",
            }}
          >
            Hủy
          </button>

          <button
            onClick={handleShare}
            disabled={sharing || !selectedUser}
            style={{
              height: "44px",
              padding: "0 26px",
              borderRadius: "999px",
              border: "none",
              background: sharing || !selectedUser ? "#3a3a3a" : "#1DB954",
              color: sharing || !selectedUser ? "#8a8a8a" : "#000",
              cursor: sharing || !selectedUser ? "not-allowed" : "pointer",
              fontWeight: 900,
              fontSize: "15px",
            }}
          >
            {sharing ? "Đang gửi..." : "Chia sẻ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareMediaModal;