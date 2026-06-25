import * as signalR from "@microsoft/signalr";
import {
  mapNotificationDtoToNotification,
  type NotificationDto,
} from "../types/notification";
import { notificationStore } from "../store/notificationStore";

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<signalR.HubConnection | null> | null = null;

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
};

export const startNotificationSignalR = async () => {
  const token = getToken();

  console.log("SIGNALR TOKEN:", token ? "HAS TOKEN" : "NO TOKEN");

  if (!token) {
    console.warn("SIGNALR: Không có token, chưa kết nối notificationHub");
    return null;
  }

  if (connection?.state === signalR.HubConnectionState.Connected) {
    console.log("SIGNALR: Đã connected sẵn");
    return connection;
  }

  if (connection?.state === signalR.HubConnectionState.Connecting) {
    console.log("SIGNALR: Đang connecting, chờ...");
    return startPromise;
  }

  if (startPromise) {
    console.log("SIGNALR: Đang có startPromise, chờ...");
    return startPromise;
  }

  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5081/notificationHub", {
        accessTokenFactory: () => getToken(),
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveNotification", (dto: NotificationDto) => {
      console.log("REALTIME RECEIVE NOTIFICATION DTO:", dto);

      const notification = mapNotificationDtoToNotification(dto);

      console.log("REALTIME MAPPED NOTIFICATION:", notification);

      notificationStore.getState().addNotification(notification);

      console.log(
        "REALTIME UNREAD COUNT:",
        notificationStore.getState().unreadCount,
      );
    });

    connection.on("ReceiveNotificationMessage", (message: string) => {
      console.log("REALTIME RECEIVE MESSAGE:", message);
    });

    connection.onreconnecting((error) => {
      console.warn("SIGNALR reconnecting:", error);
    });

    connection.onreconnected((connectionId) => {
      console.log("SIGNALR reconnected:", connectionId);
    });

    connection.onclose((error) => {
      console.warn("SIGNALR closed:", error);
      startPromise = null;
    });
  }

  startPromise = connection
    .start()
    .then(() => {
      console.log("SIGNALR CONNECTED:", connection?.connectionId);
      return connection;
    })
    .catch((error) => {
      console.error("SIGNALR notificationHub start error:", error);

      connection = null;
      return null;
    })
    .finally(() => {
      startPromise = null;
    });

  return startPromise;
};

export const stopNotificationSignalR = async () => {
  if (!connection) return;

  try {
    if (
      connection.state === signalR.HubConnectionState.Connected ||
      connection.state === signalR.HubConnectionState.Connecting ||
      connection.state === signalR.HubConnectionState.Reconnecting
    ) {
      await connection.stop();
      console.log("SIGNALR STOPPED");
    }
  } catch (error) {
    console.error("STOP SIGNALR ERROR:", error);
  } finally {
    connection = null;
    startPromise = null;
  }
};