import type { Media } from "../types/media";

// NEW: dữ liệu nhạc giả để test khi chưa có backend
export const mockTracks: Media[] = [
  {
    id: "mock-1",
    title: "Yêu Một Người Có Lẽ",
    description: "Bài test phát nhạc",
    type: "audio",
    status: "published",

    // NEW: file nhạc đặt trong public/mock/audio/
    url: "../../public/kontraa-water-afro-pop-music-445661.mp3",

    // NEW: ảnh đặt trong public/mock/images/
    thumbnailUrl: "/mock/images/yeu-mot-nguoi-co-le.jpg",

    duration: 253,
    artist: {
      id: 1,
      name: "Lou Hoàng, Miu Lê",
    },
    genre: "Pop",
    playCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-2",
    title: "Bông Hoa Đẹp Nhất",
    description: "Bài test phát nhạc",  
    type: "audio",
    status: "published",
    url: "../../public/artmylife-powerful-dramatic-trailer-514242.mp3",
    thumbnailUrl: "/mock/images/bong-hoa-dep-nhat.jpg",
    duration: 210,
    artist: {
      id: 2,
      name: "Quân A.P",
    },
    genre: "Pop",
    playCount: 0,
    createdAt: new Date().toISOString(),
  }
];