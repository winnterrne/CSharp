export const SIGNALR_HUB_URL = "https://localhost:5001/hubs/notification";

export const SIGNALR_EVENTS = {
  // Nhận từ server
  RECEIVE_NOTIFICATION: "ReceiveNotification",
  UNREAD_COUNT_UPDATED: "UnreadCountUpdated",

  // Gửi lên server
  MARK_AS_READ: "MarkAsRead",
} as const;