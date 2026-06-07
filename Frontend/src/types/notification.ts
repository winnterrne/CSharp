export type NotificationType =
  | "new_release"
  | "follow"
  | "playlist_update"
  | "system";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}