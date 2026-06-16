export type NotificationType =
  | "new_release"
  | "follow"
  | "playlist_update"
  | "share"
  | "system"
  | string;

export interface Notification {
  id: number;
  title: string;
  type: NotificationType;
  payload: string;
  isRead: boolean;
  userId?: string;
  noticedAt: string;
}

export interface NotificationDto {
  notificationID: number;
  title?: string;
  type?: string;
  payload?: string;
  isRead: boolean;
  userID?: string;
  noticedAT: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

export const mapNotificationDtoToNotification = (
  dto: NotificationDto,
): Notification => ({
  id: dto.notificationID,
  title: dto.title ?? "Thông báo",
  type: dto.type ?? "system",
  payload: dto.payload ?? "",
  isRead: dto.isRead,
  userId: dto.userID,
  noticedAt: dto.noticedAT,
});
