# 🎵 TuneVault — Backend

> **Môn học / Course:** C# and .NET Development — Học kỳ 3 2026  
> **Trường / University:** Trường Đại học Sài Gòn — Khoa Công nghệ Thông tin  
> **Loại hình / Type:** Bài tập lớn nhóm (tối đa 6 sinh viên)

---

## 📑 Mục lục / Table of Contents

- [Giới thiệu / Overview](#giới-thiệu--overview)
- [Công nghệ sử dụng / Tech Stack](#công-nghệ-sử-dụng--tech-stack)
- [Kiến trúc / Architecture](#kiến-trúc--architecture)
- [Cấu trúc thư mục / Project Structure](#cấu-trúc-thư-mục--project-structure)
- [Cài đặt & Chạy local / Setup & Run](#cài-đặt--chạy-local--setup--run)
- [Cấu hình Database / Database Setup](#cấu-hình-database--database-setup)
- [Tài khoản mẫu / Seed Accounts](#tài-khoản-mẫu--seed-accounts)
- [Danh sách API / API Endpoints](#danh-sách-api--api-endpoints)
- [10 Chức năng bắt buộc / 10 Required Features](#10-chức-năng-bắt-buộc--10-required-features)
- [Application Pipeline](#application-pipeline)
- [Thành viên nhóm / Team Members](#thành-viên-nhóm--team-members)

---

## Giới thiệu / Overview

**VI:** TuneVault là nền tảng phát nhạc và video trực tuyến, xây dựng theo mô hình Spotify. Backend cung cấp RESTful API cho phép người dùng tải lên, phát, chia sẻ media, và nhận thông báo real-time.

**EN:** TuneVault is an online music and video streaming platform modelled after Spotify. The backend exposes a RESTful API that allows users to upload, stream, share media files, and receive real-time notifications.

---

## Công nghệ sử dụng / Tech Stack

| Thành phần / Component | Công nghệ / Technology |
|---|---|
| Framework | ASP.NET Core 8 Web API |
| Kiến trúc / Architecture | Clean Architecture (4 layers) |
| ORM / Data Access | Dapper |
| Cơ sở dữ liệu / Database | SQL Server (LocalDB) |
| Xác thực / Authentication | JWT Bearer Token + ASP.NET Core Identity |
| Real-time | SignalR |
| Tài liệu API / API Docs | Swagger / OpenAPI |
| Lưu file / File Storage | Local Disk (`/wwwroot/media`) |
| Validation | FluentValidation |
| Pattern | MediatR (CQRS Pipeline) |

---

## Kiến trúc / Architecture

**VI:** Dự án tuân theo Clean Architecture với 4 project độc lập. Quy tắc phụ thuộc: Domain không phụ thuộc ai; Application chỉ phụ thuộc Domain; Infrastructure implement interface từ Domain/Application; API chỉ gọi Application.

**EN:** The project follows Clean Architecture with 4 independent projects. Dependency rule: Domain has no outward dependencies; Application depends only on Domain; Infrastructure implements Domain/Application interfaces; API calls only Application.

```
React Frontend
      │  HTTP / SignalR
      ▼
┌─────────────────────┐
│   TuneVault.API     │  Controllers, Middleware, Swagger, DI
└────────┬────────────┘
         │ calls
┌────────▼────────────┐
│ TuneVault.Application│  Use Cases, DTOs, Validators, Pipeline Behaviors
└────────┬────────────┘
         │ depends on
┌────────▼────────────┐
│  TuneVault.Domain   │  Entities, Interfaces, Enums
└────────▲────────────┘
         │ implements
┌────────┴────────────┐
│TuneVault.Infrastructure│ Dapper Repositories, File Storage, SignalR Hub
└─────────────────────┘
```

---

## Cấu trúc thư mục / Project Structure

```
TuneVault.sln
│
├── TuneVault.Domain/
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── MediaItem.cs          # bài hát / video
│   │   ├── Album.cs
│   │   ├── Playlist.cs
│   │   ├── PlaylistTrack.cs
│   │   ├── MediaShare.cs         # chia sẻ media giữa users
│   │   ├── Notification.cs       # thông báo real-time
│   │   ├── Favorite.cs
│   │   ├── PlayHistory.cs
│   │   └── Follow.cs
│   └── Interfaces/
│       ├── IMediaRepository.cs
│       ├── IUserRepository.cs
│       ├── IPlaylistRepository.cs
│       ├── IShareRepository.cs
│       └── INotificationRepository.cs
│
├── TuneVault.Application/
│   ├── DTOs/
│   │   ├── MediaDto.cs
│   │   ├── UserDto.cs
│   │   ├── PlaylistDto.cs
│   │   ├── ShareMediaDto.cs
│   │   └── NotificationDto.cs
│   ├── UseCases/
│   │   ├── Auth/
│   │   │   ├── RegisterCommand.cs
│   │   │   └── LoginCommand.cs
│   │   ├── Media/
│   │   │   ├── UploadMediaCommand.cs
│   │   │   └── StreamMediaQuery.cs
│   │   ├── Playlist/
│   │   │   ├── CreatePlaylistCommand.cs
│   │   │   └── AddTrackToPlaylistCommand.cs
│   │   ├── Share/
│   │   │   ├── ShareMediaCommand.cs
│   │   │   └── GetSharedMediaQuery.cs
│   │   └── Notify/
│   │       ├── GetNotificationsQuery.cs
│   │       └── MarkNotificationReadCommand.cs
│   └── Validators/
│       ├── RegisterValidator.cs
│       └── UploadMediaValidator.cs
│
├── TuneVault.Infrastructure/
│   ├── Data/
│   │   ├── DapperContext.cs       # IDbConnection → SQL Server
│   │   └── Scripts/
│   │       ├── schema.sql         # tạo toàn bộ bảng
│   │       └── seed.sql           # dữ liệu mẫu
│   ├── Repositories/
│   │   ├── MediaRepository.cs
│   │   ├── UserRepository.cs
│   │   ├── PlaylistRepository.cs
│   │   ├── ShareRepository.cs
│   │   └── NotificationRepository.cs
│   ├── Storage/
│   │   └── LocalFileStorage.cs    # lưu mp3 / mp4 lên disk
│   └── Hubs/
│       └── NotificationHub.cs     # SignalR Hub
│
└── TuneVault.API/
    ├── Controllers/
    │   ├── AuthController.cs
    │   ├── MediaController.cs
    │   ├── PlaylistController.cs
    │   ├── ShareController.cs
    │   ├── NotificationController.cs
    │   └── UserController.cs
    ├── Middleware/
    │   └── ExceptionMiddleware.cs
    ├── Program.cs                  # DI, JWT, Swagger, CORS, SignalR
    └── appsettings.json
```

---

## Cài đặt & Chạy local / Setup & Run

### Yêu cầu / Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server Express](https://www.microsoft.com/sql-server) hoặc SQL Server LocalDB
- [Node.js 20+](https://nodejs.org) (để chạy Frontend)

### Bước 1 — Clone repository

```bash
git clone https://github.com/<your-org>/tunevault.git
cd tunevault
```

### Bước 2 — Cấu hình connection string

Mở file `TuneVault.API/appsettings.json` và chỉnh `ConnectionStrings`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TuneVaultDb;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "your-secret-key-at-least-32-characters",
    "Issuer": "TuneVaultAPI",
    "Audience": "TuneVaultClient",
    "ExpireMinutes": 60
  }
}
```

### Bước 3 — Tạo database & seed data

**VI:** Dự án dùng Dapper nên không có EF migration. Chạy script SQL thủ công:

**EN:** The project uses Dapper (no EF migrations). Run the SQL scripts manually:

```bash
# Dùng sqlcmd hoặc mở trong SSMS
sqlcmd -S (localdb)\mssqllocaldb -i TuneVault.Infrastructure/Data/Scripts/schema.sql
sqlcmd -S (localdb)\mssqllocaldb -i TuneVault.Infrastructure/Data/Scripts/seed.sql
```

Hoặc / Or: mở SSMS → kết nối `(localdb)\mssqllocaldb` → mở và chạy 2 file `.sql` theo thứ tự.

### Bước 4 — Chạy backend

```bash
cd TuneVault.API
dotnet run
```

Backend chạy tại / Backend runs at: `https://localhost:5001`  
Swagger UI: `https://localhost:5001/swagger`

---

## Cấu hình Database / Database Setup

**VI:** Dự án sử dụng Dapper với SQL Server. Toàn bộ schema được định nghĩa trong `schema.sql`.

**EN:** The project uses Dapper with SQL Server. The full schema is defined in `schema.sql`.

### Các bảng chính / Main Tables

| Bảng / Table | Mô tả / Description |
|---|---|
| `AspNetUsers` | Tài khoản người dùng (ASP.NET Identity) |
| `UserProfiles` | Thông tin profile mở rộng (avatar, bio) |
| `MediaItems` | Bài hát & video (đường dẫn file, thời lượng, loại) |
| `Albums` | Album nhạc |
| `Playlists` | Danh sách phát (công khai / riêng tư) |
| `PlaylistTracks` | Quan hệ nhiều-nhiều Playlist ↔ MediaItem |
| `MediaShares` | Lịch sử chia sẻ media giữa người dùng |
| `Notifications` | Thông báo (JSON payload, trạng thái đã đọc) |
| `Favorites` | Bài hát yêu thích của người dùng |
| `PlayHistories` | Lịch sử nghe gần đây |
| `Follows` | Theo dõi user / nghệ sĩ |

---

## Tài khoản mẫu / Seed Accounts

**VI:** Sau khi chạy `seed.sql`, các tài khoản sau sẵn sàng để test:

**EN:** After running `seed.sql`, the following accounts are ready for testing:

| Email | Mật khẩu / Password | Vai trò / Role |
|---|---|---|
| `admin@tunevault.com` | `Admin@123` | Admin |
| `user1@tunevault.com` | `User@123` | User |
| `user2@tunevault.com` | `User@123` | User |

**Dữ liệu seed bao gồm / Seed data includes:**
- 3 người dùng / users
- 10 media items (6 audio mp3, 4 video mp4)
- 2 playlist (1 công khai, 1 riêng tư)
- Dữ liệu chia sẻ và thông báo mẫu / Sample share & notification records

---

## Danh sách API / API Endpoints

**VI:** Tổng cộng 20+ endpoints. Xem chi tiết tại Swagger: `https://localhost:5001/swagger`

**EN:** 20+ endpoints in total. Full details available at Swagger: `https://localhost:5001/swagger`

### Authentication
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/auth/register` | Đăng ký tài khoản |
| `POST` | `/api/auth/login` | Đăng nhập, nhận JWT |
| `POST` | `/api/auth/logout` | Đăng xuất |

### User / Profile
| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/users/{id}` | Xem profile |
| `PUT` | `/api/users/{id}` | Cập nhật profile, avatar |
| `POST` | `/api/users/{id}/follow` | Theo dõi người dùng |

### Media
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/media/upload` | Upload file audio/video |
| `GET` | `/api/media` | Danh sách media |
| `GET` | `/api/media/{id}` | Chi tiết media |
| `GET` | `/api/media/{id}/stream` | Stream audio/video (Range header) |
| `DELETE` | `/api/media/{id}` | Xóa media (chủ sở hữu) |

### Playlist
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/playlists` | Tạo playlist |
| `GET` | `/api/playlists/{id}` | Xem playlist |
| `PUT` | `/api/playlists/{id}` | Sửa playlist |
| `DELETE` | `/api/playlists/{id}` | Xóa playlist |
| `POST` | `/api/playlists/{id}/tracks` | Thêm bài vào playlist |
| `DELETE` | `/api/playlists/{id}/tracks/{trackId}` | Xóa bài khỏi playlist |

### Search
| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/search?q=&type=&page=&size=` | Tìm kiếm media, playlist, user |

### Share ⭐
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/shares` | Chia sẻ media/playlist cho user |
| `GET` | `/api/shares/received` | Danh sách "Chia sẻ với tôi" |
| `GET` | `/api/shares/sent` | Danh sách "Tôi đã chia sẻ" |

### Notifications ⭐
| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/notifications` | Danh sách thông báo |
| `PUT` | `/api/notifications/{id}/read` | Đánh dấu đã đọc |
| `PUT` | `/api/notifications/read-all` | Đánh dấu tất cả đã đọc |

### Interactions
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/media/{id}/favorite` | Thêm/bỏ yêu thích |
| `GET` | `/api/users/me/history` | Lịch sử nghe gần đây |

> ⭐ Chức năng 8 (Share) và 9 (Notifications) được chấm kỹ hơn theo rubric.

---

## 10 Chức năng bắt buộc / 10 Required Features

| # | Chức năng | Endpoint chính | Trạng thái |
|---|---|---|---|
| 1 | Xác thực (Register/Login/Logout) | `POST /api/auth/*` | ✅ |
| 2 | Hồ sơ người dùng | `GET/PUT /api/users/{id}` | ✅ |
| 3 | Thư viện Media (Upload metadata + file) | `POST /api/media/upload` | ✅ |
| 4 | Audio Player (Stream + Play History) | `GET /api/media/{id}/stream` | ✅ |
| 5 | Video Player (Stream + Range requests) | `GET /api/media/{id}/stream` | ✅ |
| 6 | Playlist CRUD | `POST/GET/PUT/DELETE /api/playlists` | ✅ |
| 7 | Tìm kiếm & Khám phá | `GET /api/search` | ✅ |
| 8 | Chia sẻ Media ⭐ | `POST /api/shares` | ✅ |
| 9 | Thông báo real-time ⭐ | `GET /api/notifications` + SignalR | ✅ |
| 10 | Like / Lịch sử nghe | `POST /api/media/{id}/favorite` | ✅ |

---

## Application Pipeline

**VI:** Mỗi chức năng đi qua pipeline xử lý thống nhất tại tầng Application:

**EN:** Every feature goes through a unified processing pipeline in the Application layer:

```
HTTP Request
     │
     ▼
Controller (API layer)
     │  gọi MediatR
     ▼
1. Validation         ← FluentValidation kiểm tra DTO đầu vào
     │
     ▼
2. Authorization      ← Kiểm tra JWT, quyền sở hữu tài nguyên
     │
     ▼
3. Handler / Use Case ← Logic nghiệp vụ, gọi Repository qua Interface
     │
     ▼
4. Repository (Dapper) ← Thực thi SQL thuần tới SQL Server
     │
     ▼
5. Side Effects       ← Tạo Notification, push SignalR (nếu có)
     │
     ▼
6. Response Mapping   ← Trả DTO chuẩn hóa (không trả Entity thô)
     │
     ▼
HTTP Response { success, data, errors }
```

### Ví dụ pipeline — Chia sẻ bài hát / Example pipeline — Share Track

```
POST /api/shares
     │
     ▼
ShareController.ShareAsync(ShareMediaDto dto)
     │  Send(new ShareMediaCommand(dto))
     ▼
ShareMediaValidator       → validate receiverId, mediaId không rỗng
     │
     ▼
ShareMediaAuthBehavior    → sender != receiver; media thuộc sender
     │
     ▼
ShareMediaHandler         → INSERT vào MediaShares
                          → INSERT vào Notifications
                          → push SignalR tới receiver
     │
     ▼
ShareMediaResponseDto     → { success: true, data: { shareId, sharedAt } }
```

---

## Thành viên nhóm / Team Members

| Họ tên | MSSV | Phân công / Role |
|---|---|---|
| Nguyễn Văn A | 123456 | Backend: Auth, Media Upload, Streaming |
| Trần Thị B | 123457 | Backend: Playlist, Search, Favorites |
| Lê Văn C | 123458 | Backend: Share Media, Notifications, SignalR |
| Phạm Thị D | 123459 | Frontend: Layout, Audio Player, Video Player |
| Hoàng Văn E | 123460 | Frontend: API Integration, Auth, SignalR Client |

---

## Ghi chú / Notes

- File media được lưu tại `TuneVault.API/wwwroot/media/` và phục vụ qua endpoint `/api/media/{id}/stream`
- Giới hạn kích thước upload: audio tối đa 50MB, video tối đa 500MB (cấu hình trong `Program.cs`)
- Định dạng file cho phép: `.mp3`, `.wav`, `.mp4`, `.webm`
- API key và connection string không được commit lên Git — dùng `appsettings.Development.json` (đã thêm vào `.gitignore`)
- SignalR Hub URL: `/hubs/notifications`

---

*TuneVault — Đại học Sài Gòn — Học kỳ 3 2026*
