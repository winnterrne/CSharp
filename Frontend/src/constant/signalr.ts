export const SIGNALR_HUB_URL = "https://localhost:5001/hubs/notification";

export const SIGNALR_EVENTS = {
  RECEIVE_NOTIFICATION: "ReceiveNotification",
  UNREAD_COUNT_UPDATED: "UnreadCountUpdated",

  MARK_AS_READ: "MarkAsRead",
} as const;