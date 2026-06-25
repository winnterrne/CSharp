export type NotificationType =
  | "share_song"
  | "share_playlist"
  | "follow"
  | "new_release"
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
  notificationID?: number;
  notificationId?: number;
  id?: number;

  title?: string;
  type?: string;
  payload?: string;
  isRead?: boolean;

  userID?: string;
  userId?: string;

  noticedAT?: string;
  noticedAt?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

export type NotificationPayload = {
  targetType?: "song" | "playlist" | "follow" | string;

  senderID?: string;
  senderName?: string;
  senderAvatar?: string;

  mediaItemID?: number;
  mediaTitle?: string;
  artistName?: string;
  imageUrl?: string;

  playlistID?: number;
  playlistName?: string;
  playlistDescription?: string;
  trackCount?: number;

  followerID?: string;
  followerName?: string;
  followerAvatar?: string;
};

export const parseNotificationPayload = (
  payload?: string,
): NotificationPayload => {
  if (!payload) return {};

  try {
    return JSON.parse(payload);
  } catch {
    return {};
  }
};

export const mapNotificationDtoToNotification = (
  dto: NotificationDto,
): Notification => ({
  id: dto.notificationID ?? dto.notificationId ?? dto.id ?? 0,
  title: dto.title ?? "Thông báo",
  type: dto.type ?? "system",
  payload: dto.payload ?? "",
  isRead: dto.isRead ?? false,
  userId: dto.userID ?? dto.userId,
  noticedAt:
    dto.noticedAT ??
    dto.noticedAt ??
    new Date().toISOString(),
});