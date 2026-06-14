import { useEffect, useState } from "react";
import { shareApi } from "../../api/shareApi";
import { userApi, type UserSearchResult } from "../../api/userApi";

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
};

const getUserId = (user: SafeUserSearchResult) => {
  return user.userID ?? user.userId ?? user.id ?? "";
};

const getUserName = (user: SafeUserSearchResult) => {
  return user.userName ?? user.username ?? user.name ?? "Unknown User";
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
        const data = res.data.data;

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
    } catch (err) {
      console.error("SHARE ERROR:", err);
      setMessage("Không chia sẻ được");
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
        background: "rgba(0,0,0,.65)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "460px",
          maxWidth: "100%",
          background: "#181818",
          color: "#fff",
          borderRadius: "14px",
          padding: "22px",
          boxShadow: "0 20px 60px rgba(0,0,0,.55)",
        }}
      >
        <h2
          style={{
            margin: "0 0 16px",
            fontSize: "22px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: "0 0 14px",
            color: "#b3b3b3",
            fontSize: "14px",
          }}
        >
          Tìm tên mà bạn muốn chia sẻ.
        </p>

        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setSelectedUser(null);
          }}
          placeholder="Nhập tên user..."
          style={{
            width: "100%",
            height: "44px",
            borderRadius: "999px",
            border: "none",
            outline: "none",
            padding: "0 16px",
            background: "#242424",
            color: "#fff",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        {searching && (
          <div
            style={{
              marginTop: "10px",
              color: "#b3b3b3",
              fontSize: "14px",
            }}
          >
            Đang tìm user...
          </div>
        )}

        {users.length > 0 && (
          <div
            style={{
              marginTop: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {users.map((user, index) => {
              const userId = getUserId(user);
              const userName = getUserName(user);
              const active = selectedUser
                ? getUserId(selectedUser) === userId
                : false;

              return (
                <button
                  key={userId || index}
                  onClick={() => {
                    setSelectedUser(user);
                    setKeyword(userName);
                    setUsers([]);
                    setMessage("");
                  }}
                  style={{
                    border: active ? "1px solid #1DB954" : "1px solid #333",
                    background: active ? "#1DB95422" : "#242424",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: "#333",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#b3b3b3",
                      flexShrink: 0,
                    }}
                  >
                    {user.userImage ? (
                      <img
                        src={user.userImage}
                        alt={userName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      userName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {userName}
                    </div>

                    {user.email && (
                      <div
                        style={{
                          color: "#b3b3b3",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.email}
                      </div>
                    )}
                  </div>
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
            }}
          >
            Đã chọn: {getUserName(selectedUser)}
          </div>
        )}

        {message && (
          <div
            style={{
              marginTop: "12px",
              color: message.includes("Đã") ? "#1DB954" : "#ff4d4f",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleClose}
            disabled={sharing}
            style={{
              height: "40px",
              padding: "0 18px",
              borderRadius: "999px",
              border: "none",
              background: "#333",
              color: "#fff",
              cursor: sharing ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
          >
            Hủy
          </button>

          <button
            onClick={handleShare}
            disabled={sharing || !selectedUser}
            style={{
              height: "40px",
              padding: "0 18px",
              borderRadius: "999px",
              border: "none",
              background: sharing || !selectedUser ? "#3a3a3a" : "#1DB954",
              color: "#000",
              cursor: sharing || !selectedUser ? "not-allowed" : "pointer",
              fontWeight: 800,
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