import * as signalR from "@microsoft/signalr";
import {
  mapNotificationDtoToNotification,
  type NotificationDto,
} from "../types/notification";
import { notificationStore } from "../store/notificationStore";

let connection: signalR.HubConnection | null = null;

// ✅ NOTIFICATION FLOW: kết nối SignalR nhận notification realtime
export const startNotificationSignalR = async () => {
  if (connection?.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  const token = localStorage.getItem("token");

  if (!token) return null;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5081/notificationHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", (dto: NotificationDto) => {
    const notification = mapNotificationDtoToNotification(dto);

    notificationStore.getState().addNotification(notification);
  });

  connection.on("ReceiveNotificationMessage", (message: string) => {
    console.log("NOTIFICATION MESSAGE:", message);
  });

  await connection.start();

  return connection;
};

export const stopNotificationSignalR = async () => {
  if (!connection) return;

  await connection.stop();
  connection = null;
};
