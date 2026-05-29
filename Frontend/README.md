frontend/
│
├── public/                     # File tĩnh public, truy cập trực tiếp
│   ├── favicon.ico             # Icon website trên tab browser
│   └── vite.svg                # Logo mặc định của Vite
│
├── src/                        # Source code chính của frontend
│   │
│   ├── api/                    # Chứa các file gọi backend API
│   │   ├── axios.ts            # Config axios chung (baseURL, token...)
│   │   ├── authApi.ts          # API login/register
│   │   ├── mediaApi.ts         # API media/audio/video
│   │   ├── playlistApi.ts      # API playlist
│   │   ├── notificationApi.ts  # API notification
│   │   ├── favoriteApi.ts      # API favorite/like
│   │   ├── historyApi.ts       # API play history
│   │   └── shareApi.ts         # API share media
│   │
│   ├── assets/                 # Tài nguyên tĩnh
│   │   ├── images/             # Hình ảnh
│   │   ├── icons/              # Icon SVG/PNG
│   │   ├── videos/             # Video local
│   │   ├── music/              # Audio local
│   │   └── fonts/              # Custom fonts
│   │
│   ├── components/             # Các component tái sử dụng
│   │   │
│   │   ├── common/             # Component dùng chung toàn app
│   │   │   ├── Button.tsx      # Nút button custom
│   │   │   ├── Input.tsx       # Input custom
│   │   │   ├── Modal.tsx       # Popup/modal
│   │   │   ├── Spinner.tsx     # Loading spinner
│   │   │   └── Loading.tsx     # Component loading
│   │   │
│   │   ├── layout/             # Component layout chính
│   │   │   ├── Sidebar.tsx     # Thanh sidebar trái
│   │   │   ├── Header.tsx      # Header phía trên
│   │   │   ├── RightPanel.tsx  # Panel phải
│   │   │   ├── PlayerBar.tsx   # Thanh player dưới cùng
│   │   │   └── MobileNavbar.tsx# Navbar mobile
│   │   │
│   │   ├── media/              # Component media
│   │   │   ├── MediaCard.tsx   # Card media tổng quát
│   │   │   ├── MediaGrid.tsx   # Grid hiển thị media
│   │   │   ├── AudioCard.tsx   # Card audio
│   │   │   ├── VideoCard.tsx   # Card video
│   │   │   └── MediaThumbnail.tsx # Thumbnail media
│   │   │
│   │   ├── player/             # Component player
│   │   │   ├── AudioPlayer.tsx # Trình phát audio
│   │   │   ├── VideoPlayer.tsx # Trình phát video
│   │   │   ├── PlayerControls.tsx # Nút play/pause/next
│   │   │   ├── ProgressBar.tsx # Thanh tiến trình
│   │   │   ├── VolumeControl.tsx # Điều chỉnh âm lượng
│   │   │   └── QueueList.tsx   # Danh sách queue nhạc
│   │   │
│   │   ├── playlist/           # Component playlist
│   │   │   ├── PlaylistCard.tsx # Card playlist
│   │   │   ├── PlaylistHeader.tsx # Header playlist
│   │   │   ├── PlaylistTracks.tsx # Danh sách bài hát
│   │   │   └── AddTrackModal.tsx # Modal thêm bài hát
│   │   │
│   │   ├── notification/       # Component notification
│   │   │   ├── NotificationBell.tsx # Chuông thông báo
│   │   │   ├── NotificationItem.tsx # 1 notification item
│   │   │   └── NotificationDropdown.tsx # Dropdown notification
│   │   │
│   │   ├── share/              # Component share media
│   │   │   ├── ShareModal.tsx  # Popup share
│   │   │   ├── ShareCard.tsx   # Card share
│   │   │   └── ShareList.tsx   # Danh sách share
│   │   │
│   │   └── ui/                 # UI component nhỏ
│   │       ├── Badge.tsx       # Badge
│   │       ├── Tooltip.tsx     # Tooltip
│   │       ├── Dropdown.tsx    # Dropdown
│   │       └── Tabs.tsx        # Tabs component
│   │
│   ├── constants/              # Hằng số toàn app
│   │   ├── api.ts              # API endpoint constants
│   │   ├── routes.ts           # Route constants
│   │   ├── storage.ts          # LocalStorage keys
│   │   └── signalr.ts          # SignalR event names
│   │
│   ├── contexts/               # React Context API
│   │   ├── AuthContext.tsx     # Context auth
│   │   ├── PlayerContext.tsx   # Context player
│   │   └── ThemeContext.tsx    # Context theme dark/light
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Hook auth
│   │   ├── usePlayer.ts        # Hook player
│   │   ├── useNotification.ts  # Hook notification
│   │   ├── useDebounce.ts      # Hook debounce search
│   │   ├── useMedia.ts         # Hook media
│   │   └── usePlaylist.ts      # Hook playlist
│   │
│   ├── layouts/                # Layout tổng của page
│   │   ├── MainLayout.tsx      # Layout chính Spotify-like
│   │   ├── AuthLayout.tsx      # Layout login/register
│   │   └── AdminLayout.tsx     # Layout admin
│   │
│   ├── pages/                  # Các page/màn hình lớn
│   │   │
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx   # Trang login
│   │   │   └── RegisterPage.tsx # Trang register
│   │   │
│   │   ├── Home/
│   │   │   └── HomePage.tsx    # Trang chủ
│   │   │
│   │   ├── Search/
│   │   │   └── SearchPage.tsx  # Trang tìm kiếm
│   │   │
│   │   ├── Library/
│   │   │   └── LibraryPage.tsx # Thư viện cá nhân
│   │   │
│   │   ├── Playlist/
│   │   │   └── PlaylistDetailPage.tsx # Chi tiết playlist
│   │   │
│   │   ├── Profile/
│   │   │   └── ProfilePage.tsx # Hồ sơ người dùng
│   │   │
│   │   ├── Notifications/
│   │   │   └── NotificationsPage.tsx # Trang notification
│   │   │
│   │   ├── ShareInbox/
│   │   │   └── ShareInboxPage.tsx # Media được share
│   │   │
│   │   ├── Favorites/
│   │   │   └── FavoritesPage.tsx # Bài hát yêu thích
│   │   │
│   │   ├── History/
│   │   │   └── HistoryPage.tsx # Lịch sử nghe
│   │   │
│   │   ├── Upload/
│   │   │   └── UploadPage.tsx  # Upload media
│   │   │
│   │   └── VideoPlayer/
│   │       └── VideoPlayerPage.tsx # Trang xem video
│   │
│   ├── routes/                 # React Router config
│   │   ├── AppRoutes.tsx       # Toàn bộ routes app
│   │   ├── ProtectedRoute.tsx # Route cần login
│   │   └── PublicRoute.tsx    # Route public
│   │
│   ├── services/               # Business logic frontend
│   │   ├── authService.ts      # Logic auth
│   │   ├── mediaService.ts     # Logic media
│   │   ├── playerService.ts    # Logic player
│   │   ├── signalrService.ts   # Kết nối SignalR
│   │   ├── storageService.ts   # Local storage/session
│   │   └── notificationService.ts # Logic notification
│   │
│   ├── store/                  # Global state (Zustand/Redux)
│   │   ├── authStore.ts        # State user/token
│   │   ├── mediaStore.ts       # State media
│   │   ├── playerStore.ts      # State player toàn app
│   │   ├── playlistStore.ts    # State playlist
│   │   └── notificationStore.ts # State notification realtime
│   │
│   ├── styles/                 # CSS global
│   │   ├── globals.css         # CSS toàn app
│   │   ├── variables.css       # CSS variables/theme
│   │   └── tailwind.css        # Tailwind import
│   │
│   ├── types/                  # TypeScript interfaces/types
│   │   ├── auth.ts             # Type auth
│   │   ├── media.ts            # Type media
│   │   ├── playlist.ts         # Type playlist
│   │   ├── notification.ts     # Type notification
│   │   ├── favorite.ts         # Type favorite
│   │   ├── history.ts          # Type history
│   │   ├── share.ts            # Type share
│   │   └── api.ts              # Type API response
│   │
│   ├── utils/                  # Hàm helper tiện ích
│   │   ├── formatTime.ts       # Format thời gian player
│   │   ├── truncateText.ts     # Cắt text dài
│   │   ├── generateThumbnail.ts # Tạo thumbnail
│   │   ├── formatDate.ts       # Format ngày tháng
│   │   └── helpers.ts          # Helper chung
│   │
│   ├── App.tsx                 # Root component app
│   ├── main.tsx                # Entry point React
│   └── vite-env.d.ts           # Type cho Vite
│
├── .env                        # Environment variables
├── .gitignore                  # File git bỏ qua
├── index.html                  # HTML root
├── package.json                # Dependencies/scripts
├── tsconfig.json               # Config TypeScript
├── vite.config.ts              # Config Vite
└── README.md                   # Hướng dẫn project