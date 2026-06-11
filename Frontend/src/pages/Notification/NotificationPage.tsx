import NotificationItem from "../../components/notification/NotificationItem";
import { useNotification } from "../../hooks/useNotification";

const NotificationPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,    
  } = useNotification();

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: "30px",
        paddingBottom: "120px",
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #1f1f1f 0%, #121212 260px)",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#fff",
              fontSize: "42px",
              margin: 0,
            }}
          >
            Thông báo
          </h1>

          <p
            style={{
              color: "#b3b3b3",
              marginTop: "8px",
            }}
          >
            {unreadCount > 0
              ? `${unreadCount} thông báo chưa đọc`
              : "Bạn đã đọc hết thông báo"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              border: "none",
              borderRadius: "999px",
              background: "#fff",
              color: "#000",
              padding: "10px 18px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Đánh dấu đã đọc
          </button>
        )}
      </section>

      {loading && <p style={{ color: "#b3b3b3" }}>Đang tải thông báo...</p>}

      {error && <p style={{ color: "#ff7676" }}>{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <div
          style={{
            minHeight: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            color: "#b3b3b3",
          }}
        >
          <div style={{ fontSize: "54px", marginBottom: "16px" }}>🔔</div>

          <h2 style={{ color: "#fff" }}>Chưa có thông báo</h2>

          <p>Các thông báo mới sẽ xuất hiện ở đây.</p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: "8px",
          maxWidth: "900px",
        }}
      >
        {notifications.map((item) => (
          <NotificationItem
            key={item.id}
            notification={item}
            onRead={markAsRead}
          />
        ))}
      </div>
    </main>
  );
};

export default NotificationPage;