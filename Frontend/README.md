# 🎵 TuneVault Frontend

Frontend của hệ thống **TuneVault** được xây dựng bằng:

* React
* TypeScript
* Vite
* Zustand
* TailwindCSS
* SignalR

Mục tiêu của project là xây dựng nền tảng nghe nhạc/xem video giống Spotify hoặc YouTube Music.

---

# 📁 Cấu trúc thư mục

```txt
frontend/
│
├── public/                     
│   ├── favicon.ico             
│   └── vite.svg                
│
├── src/                        
│   │
│   ├── api/                    
│   │   ├── axios.ts            
│   │   ├── authApi.ts          
│   │   ├── mediaApi.ts         
│   │   ├── playlistApi.ts      
│   │   ├── notificationApi.ts  
│   │   ├── favoriteApi.ts      
│   │   ├── historyApi.ts       
│   │   └── shareApi.ts         
│   │
│   ├── assets/                 
│   │   ├── images/             
│   │   ├── icons/              
│   │   ├── videos/             
│   │   ├── music/              
│   │   └── fonts/              
│   │
│   ├── components/             
│   │   │
│   │   ├── common/             
│   │   │   ├── Button.tsx      
│   │   │   ├── Input.tsx       
│   │   │   ├── Modal.tsx       
│   │   │   ├── Spinner.tsx     
│   │   │   └── Loading.tsx     
│   │   │
│   │   ├── layout/             
│   │   │   ├── Sidebar.tsx     
│   │   │   ├── Header.tsx      
│   │   │   ├── RightPanel.tsx  
│   │   │   ├── PlayerBar.tsx   
│   │   │   └── MobileNavbar.tsx
│   │   │
│   │   ├── media/              
│   │   │   ├── MediaCard.tsx   
│   │   │   ├── MediaGrid.tsx   
│   │   │   ├── AudioCard.tsx   
│   │   │   ├── VideoCard.tsx   
│   │   │   └── MediaThumbnail.tsx
│   │   │
│   │   ├── player/             
│   │   │   ├── AudioPlayer.tsx 
│   │   │   ├── VideoPlayer.tsx 
│   │   │   ├── PlayerControls.tsx
│   │   │   ├── ProgressBar.tsx 
│   │   │   ├── VolumeControl.tsx
│   │   │   └── QueueList.tsx   
│   │   │
│   │   ├── playlist/           
│   │   │   ├── PlaylistCard.tsx
│   │   │   ├── PlaylistHeader.tsx
│   │   │   ├── PlaylistTracks.tsx
│   │   │   └── AddTrackModal.tsx
│   │   │
│   │   ├── notification/       
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── NotificationDropdown.tsx
│   │   │
│   │   ├── share/              
│   │   │   ├── ShareModal.tsx  
│   │   │   ├── ShareCard.tsx   
│   │   │   └── ShareList.tsx   
│   │   │
│   │   └── ui/                 
│   │       ├── Badge.tsx       
│   │       ├── Tooltip.tsx     
│   │       ├── Dropdown.tsx    
│   │       └── Tabs.tsx        
│   │
│   ├── constants/              
│   │   ├── api.ts              
│   │   ├── routes.ts           
│   │   ├── storage.ts          
│   │   └── signalr.ts          
│   │
│   ├── contexts/               
│   │   ├── AuthContext.tsx     
│   │   ├── PlayerContext.tsx   
│   │   └── ThemeContext.tsx    
│   │
│   ├── hooks/                  
│   │   ├── useAuth.ts          
│   │   ├── usePlayer.ts        
│   │   ├── useNotification.ts  
│   │   ├── useDebounce.ts      
│   │   ├── useMedia.ts         
│   │   └── usePlaylist.ts      
│   │
│   ├── layouts/                
│   │   ├── MainLayout.tsx      
│   │   ├── AuthLayout.tsx      
│   │   └── AdminLayout.tsx     
│   │
│   ├── pages/                  
│   │   │
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   │
│   │   ├── Home/
│   │   │   └── HomePage.tsx
│   │   │
│   │   ├── Search/
│   │   │   └── SearchPage.tsx
│   │   │
│   │   ├── Library/
│   │   │   └── LibraryPage.tsx
│   │   │
│   │   ├── Playlist/
│   │   │   └── PlaylistDetailPage.tsx
│   │   │
│   │   ├── Profile/
│   │   │   └── ProfilePage.tsx
│   │   │
│   │   ├── Notifications/
│   │   │   └── NotificationsPage.tsx
│   │   │
│   │   ├── ShareInbox/
│   │   │   └── ShareInboxPage.tsx
│   │   │
│   │   ├── Favorites/
│   │   │   └── FavoritesPage.tsx
│   │   │
│   │   ├── History/
│   │   │   └── HistoryPage.tsx
│   │   │
│   │   ├── Upload/
│   │   │   └── UploadPage.tsx
│   │   │
│   │   └── VideoPlayer/
│   │       └── VideoPlayerPage.tsx
│   │
│   ├── routes/                 
│   │   ├── AppRoutes.tsx       
│   │   ├── ProtectedRoute.tsx  
│   │   └── PublicRoute.tsx     
│   │
│   ├── services/               
│   │   ├── authService.ts      
│   │   ├── mediaService.ts     
│   │   ├── playerService.ts    
│   │   ├── signalrService.ts   
│   │   ├── storageService.ts   
│   │   └── notificationService.ts
│   │
│   ├── store/                  
│   │   ├── authStore.ts        
│   │   ├── mediaStore.ts       
│   │   ├── playerStore.ts      
│   │   ├── playlistStore.ts    
│   │   └── notificationStore.ts
│   │
│   ├── styles/                 
│   │   ├── globals.css         
│   │   ├── variables.css       
│   │   └── tailwind.css        
│   │
│   ├── types/                  
│   │   ├── auth.ts             
│   │   ├── media.ts            
│   │   ├── playlist.ts         
│   │   ├── notification.ts     
│   │   ├── favorite.ts         
│   │   ├── history.ts          
│   │   ├── share.ts            
│   │   └── api.ts              
│   │
│   ├── utils/                  
│   │   ├── formatTime.ts       
│   │   ├── truncateText.ts     
│   │   ├── generateThumbnail.ts
│   │   ├── formatDate.ts       
│   │   └── helpers.ts          
│   │
│   ├── App.tsx                 
│   ├── main.tsx                
│   └── vite-env.d.ts           
│
├── .env                        
├── .gitignore                  
├── index.html                  
├── package.json                
├── tsconfig.json               
├── vite.config.ts              
└── README.md                   
```

---

# 🚀 Cách chạy project

## 1. Cài dependencies

```bash
npm install
```

---

## 2. Chạy development server

```bash
npm run dev
```

---

# 📦 Các thư viện chính

## React Router

```bash
npm install react-router-dom
```

Dùng để điều hướng trang.

---

## Axios

```bash
npm install axios
```

Dùng để gọi API backend.

---

## Zustand

```bash
npm install zustand
```

Dùng để quản lý global state.

---

## SignalR

```bash
npm install @microsoft/signalr
```

Dùng cho realtime notification/chat/player sync.

---

## TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

Framework CSS utility-first.

---

# 🧠 Kiến trúc frontend

Flow hoạt động chính:

```txt
Page
 ↓
Layout
 ↓
Components
 ↓
API / Services
 ↓
Backend
```

---

# 📌 Quy ước đặt tên

## Component

```txt
PascalCase
```

Ví dụ:

```txt
MediaCard.tsx
PlayerBar.tsx
```

---

## Hook

```txt
useSomething.ts
```

Ví dụ:

```txt
useAuth.ts
usePlayer.ts
```

---

## Store

```txt
somethingStore.ts
```

Ví dụ:

```txt
authStore.ts
playerStore.ts
```

---

# 🎯 Chức năng chính

* Authentication
* Upload media
* Audio/Video player
* Playlist management
* Favorite system
* Play history
* Share media
* Realtime notification
* Search media
* Responsive UI

---

# 🔥 Công nghệ sử dụng

| Công nghệ   | Vai trò          |
| ----------- | ---------------- |
| React       | UI Library       |
| TypeScript  | Type safety      |
| Vite        | Build tool       |
| Zustand     | State management |
| Axios       | HTTP client      |
| SignalR     | Realtime         |
| TailwindCSS | Styling          |

---

# 👨‍💻 Team Development Notes

* Không viết toàn bộ logic trong page
* Component phải reusable
* API call nên tách riêng trong `api/`
* Global state để trong `store/`
* Không hardcode URL/API

---

# 📌 Future Improvements

* Dark mode
* Infinite scroll
* Media recommendation
* Realtime chat
* Upload progress
* Admin dashboard
* AI recommendation system
