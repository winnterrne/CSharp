import type { Media } from "../types/media";

export const mockRecommended: Media[] = [
  {
    id: "1",
    title: "Lạc Trôi",
    type: "audio",
    status: "published",
    url: "/mock/audio/lac-troi.mp3",
    thumbnailUrl: "https://picsum.photos/300?1",
    duration: 245,
    genre: "Pop",
    artist: {
      id: 1,
      name: "Sơn Tùng M-TP",
    },
    createdAt: new Date().toISOString(),
  },

  {
    id: "2",
    title: "Chúng Ta Của Hiện Tại",
    type: "audio",
    status: "published",
    url: "/mock/audio/ctcht.mp3",
    thumbnailUrl: "https://picsum.photos/300?2",
    duration: 280,
    genre: "Pop",
    artist: {
      id: 2,
      name: "Sơn Tùng M-TP",
    },
    createdAt: new Date().toISOString(),
  },

  {
    id: "3",
    title: "Waiting For You",
    type: "audio",
    status: "published",
    url: "/mock/audio/waiting.mp3",
    thumbnailUrl: "https://picsum.photos/300?3",
    duration: 210,
    genre: "Ballad",
    artist: {
      id: 3,
      name: "MONO",
    },
    createdAt: new Date().toISOString(),
  },

  {
    id: "4",
    title: "Nơi Này Có Anh",
    type: "audio",
    status: "published",
    url: "/mock/audio/noinaycoanh.mp3",
    thumbnailUrl: "https://picsum.photos/300?4",
    duration: 230,
    genre: "Pop",
    artist: {
      id: 4,
      name: "Sơn Tùng M-TP",
    },
    createdAt: new Date().toISOString(),
  },

  {
    id: "5",
    title: "Ngày Đầu Tiên",
    type: "audio",
    status: "published",
    url: "/mock/audio/ngaydautien.mp3",
    thumbnailUrl: "https://picsum.photos/300?5",
    duration: 220,
    genre: "Pop",
    artist: {
      id: 5,
      name: "Đức Phúc",
    },
    createdAt: new Date().toISOString(),
  },

  {
    id: "6",
    title: "See Tình",
    type: "audio",
    status: "published",
    url: "/mock/audio/seetinh.mp3",
    thumbnailUrl: "https://picsum.photos/300?6",
    duration: 198,
    genre: "Dance",
    artist: {
      id: 6,
      name: "Hoàng Thùy Linh",
    },
    createdAt: new Date().toISOString(),
  },
];

export const mockForYou = [...mockRecommended];

export const mockUpcoming = [...mockRecommended];