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

### 1. Chi tiết 10 Application Pipelines (Chú thích chi tiết từng dòng)

Dưới đây là chi tiết luồng xử lý (Application Pipeline) của 10 chức năng hệ thống theo cấu trúc MediatR CQRS, FluentValidation và Clean Architecture.

#### 1.1. Chức năng 1: Xác thực (Authentication)
* **Đăng ký tài khoản (Register):**
```
RegisterCommand
  -> RegisterValidator             % Xác thực thông tin đầu vào (UserName, Email, Password) hợp lệ bằng FluentValidation
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động kiểm tra lỗi và ném ValidationException nếu có
  -> RegisterHandler               % Xử lý nghiệp vụ: băm mật khẩu, lưu tài khoản qua Dapper và tạo JWT Token
  -> AuthResponseDto               % Trả về DTO chứa thông tin tài khoản và chuỗi JWT Token để xác thực các request sau
```

* **Đăng nhập (Login):**
```
LoginCommand
  -> LoginValidator                % Kiểm tra định dạng Email và Password không được trống
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động xác thực dữ liệu đầu vào
  -> LoginHandler                  % Nghiệp vụ: xác thực thông tin đăng nhập trong DB, kiểm tra mật khẩu và cấp JWT Token
  -> AuthResponseDto               % Trả về DTO chứa thông tin đăng nhập và chuỗi JWT Token hợp lệ
```

#### 1.2. Chức năng 2: Hồ sơ người dùng (User Profile)
* **Xem hồ sơ người dùng:**
```
GetProfileQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (Query này không cần validator)
  -> GetProfileHandler             % Truy vấn DB qua Dapper lấy thông tin hồ sơ người dùng (UserName, Email, UserImage, Bio)
  -> UserDTO                       % Trả về DTO chứa thông tin chi tiết hồ sơ người dùng hiển thị lên giao diện
```

* **Cập nhật hồ sơ người dùng:**
```
UpdateProfileCommand
  -> UpdateProfileValidator        % Xác thực dữ liệu cập nhật (UserName không trống, định dạng ảnh đại diện hợp lệ)
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động kiểm duyệt lỗi đầu vào
  -> UpdateProfileHandler          % Nghiệp vụ: Cập nhật thông tin profile (UserName, UserImage, Bio) trong bảng AspNetUsers
  -> int                           % Trả về số dòng bị ảnh hưởng trong database (1: Thành công, 0: Thất bại)
```

#### 1.3. Chức năng 3: Thư viện Media (Media Library)
* **Tải lên tệp phương tiện (Audio/Video):**
```
UploadMediaCommand
  -> UploadMediaValidator          % Kiểm tra tiêu đề, định dạng tệp (mp3, wav, mp4) và kích thước tệp tải lên
  -> ValidationBehavior            % MediatR Pipeline Behavior kiểm duyệt dữ liệu file đính kèm và metadata
  -> UploadMediaHandler            % Nghiệp vụ: lưu file vật lý qua FileStorageService và chèn metadata vào bảng MediaItem
  -> MediaItemDto                  % Trả về thông tin chi tiết tệp phương tiện vừa được tạo thành công trong hệ thống
```

#### 1.4. Chức năng 4: Audio Player (Trình phát nhạc)
* **Truyền phát audio (HTTP Range Requests):**
```
GetMediaInfoQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> GetMediaInfoQueryHandler      % Lấy thông tin bài hát và đường dẫn vật lý tệp tin từ bảng MediaItem
  -> MediaItemDto                  % Trả về DTO chứa đường dẫn tệp để API Controller tạo luồng phát nhạc (HTTP Range Request 206)
```

* **Ghi nhận lịch sử nghe nhạc:**
```
RecordPlayHistoryCommand
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> RecordPlayHistoryHandler      % Nghiệp vụ: Thêm bản ghi mới lưu vết người dùng vừa nghe bài hát vào bảng PlayHistory
  -> int                           % Trả về số lượng dòng bị ảnh hưởng (1: Đã lưu lịch sử thành công)
```

#### 1.5. Chức năng 5: Video Player (Trình phát video)
* **Truyền phát video (HTTP Range Requests):**
```
GetMediaInfoQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> GetMediaInfoQueryHandler      % Lấy thông tin video và đường dẫn tệp video (.mp4, .webm) từ DB qua Dapper
  -> MediaItemDto                  % Trả về thông tin video phục vụ luồng truyền tải video chunk-by-chunk trên giao diện
```

#### 1.6. Chức năng 6: Playlist (Danh sách phát)
* **Tạo danh sách phát mới:**
```
CreatePlaylistCommand
  -> CreatePlaylistValidator       % Xác thực thông tin đầu vào (PlaylistName không được để trống)
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động xác thực tên playlist
  -> CreatePlaylistHandler         % Nghiệp vụ: Thực thi câu lệnh SQL INSERT tạo bản ghi mới trong bảng Playlist
  -> int                           % Trả về ID tự tăng của Playlist vừa được tạo thành công
```

* **Thêm bài hát vào danh sách phát:**
```
AddTrackToPlaylistCommand
  -> AddTrackToPlaylistValidator   % Xác thực sự tồn tại của PlaylistID và MediaItemID
  -> ValidationBehavior            % MediatR Pipeline Behavior kiểm tra tính hợp lệ của liên kết track-playlist
  -> AddTrackToPlaylistHandler     % Nghiệp vụ: Chèn bản ghi liên kết vào bảng trung gian PlaylistTrack
  -> int                           % Trả về số lượng dòng bị ảnh hưởng (1: Thêm bài hát thành công)
```

#### 1.7. Chức năng 7: Tìm kiếm & Khám phá (Search & Discovery)
* **Tìm kiếm bài hát, nghệ sĩ, playlist:**
```
SearchMediaQuery
  -> SearchMediaValidator          % Kiểm tra từ khóa tìm kiếm (SearchTerm không trống) và tham số phân trang
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động xác thực các tham số tìm kiếm
  -> SearchMediaQueryHandler       % Nghiệp vụ: Truy vấn Dapper thực hiện tìm kiếm đa bảng (MediaItem, Artist, Playlist)
  -> List<MediaItemDto>            % Trả về danh sách kết quả bài hát/video khớp với từ khóa kèm phân trang
```

#### 1.8. Chức năng 8: Chia sẻ Media (Media Share)
* **Chia sẻ bài hát hoặc playlist cho người dùng khác:**
```
ShareMediaCommand
  -> ShareMediaValidator           % Xác thực sự tồn tại của ReceiverID, MediaItemID/PlaylistID và định dạng đầu vào
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động kiểm duyệt dữ liệu chia sẻ
  -> ShareMediaHandler             % Nghiệp vụ: Tạo bản ghi MediaShare, tạo thông báo mới Notification, gửi realtime qua SignalR
  -> ShareMediaResponseDto         % Trả về DTO chứa thông tin chi tiết của giao dịch chia sẻ vừa hoàn thành
```

#### 1.9. Chức năng 9: Thông báo (Real-time Notifications)
* **Lấy danh sách thông báo:**
```
GetNotificationsQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> GetNotificationsHandler       % Nghiệp vụ: Truy vấn bảng Notification lấy các thông báo của người dùng qua Dapper
  -> IEnumerable<NotificationDto>  % Trả về danh sách thông báo kèm payload chi tiết (chứa link, loại thông báo)
```

* **Đánh dấu thông báo đã đọc:**
```
MarkNotificationReadCommand
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> MarkNotificationReadHandler   % Nghiệp vụ: Cập nhật trạng thái IsRead = true cho thông báo theo ID trong DB
  -> int                           % Trả về số dòng được cập nhật thành công (1: Thành công)
```

#### 1.10. Chức năng 10: Tương tác & Lịch sử (Interaction & History)
* **Thêm bài hát vào danh sách yêu thích:**
```
AddFavoriteCommand
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> AddFavoriteHandler            % Nghiệp vụ: Chèn cặp giá trị (UserID, MediaItemID) vào bảng Favorite qua Dapper
  -> int                           % Trả về số lượng dòng bị ảnh hưởng (1: Đã thích thành công)
```

* **Lấy danh sách lịch sử nghe nhạc gần đây:**
```
GetRecentPlayHistoryQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> GetRecentPlayHistoryHandler   % Nghiệp vụ: Truy vấn bảng PlayHistory lấy 10 bài hát đã phát gần nhất kèm thời gian
  -> IEnumerable<PlayHistoryDTO>   % Trả về danh sách DTO thông tin 10 bài hát được nghe gần nhất của người dùng
```

### 2. Mô tả chi tiết hoạt động của từng Pipeline

Dưới đây là mô tả chi tiết quy trình xử lý, các nghiệp vụ kiểm tra và bảng dữ liệu tương tác cho từng chức năng:

* **Chức năng 1: Xác thực (Authentication)**: Đăng ký mã hóa mật khẩu và tạo tài khoản trong bảng `AspNetUsers`, cấp phát JWT Token. Đăng nhập đối chiếu mật khẩu và cấp Token phiên làm việc.
* **Chức năng 2: Hồ sơ người dùng (User Profile)**: Xem hồ sơ truy xuất thông tin từ bảng `AspNetUsers` qua Dapper. Cập nhật hồ sơ thực hiện cập nhật ảnh đại diện và bio trong database.
* **Chức năng 3: Thư viện Media (Media Library)**: Tải lên tệp tin và lưu trữ file vật lý trên máy chủ, đồng thời lưu trữ siêu dữ liệu vào bảng `MediaItem` trong DB.
* **Chức năng 4: Audio Player (Trình phát nhạc)**: Truyền phát luồng nhạc chunk-by-chunk qua HTTP 206 Range Requests, và tự động lưu vết lượt nghe vào bảng `PlayHistory`.
* **Chức năng 5: Video Player (Trình phát video)**: Truyền phát luồng video dung lượng lớn qua HTTP Range Request (206) hỗ trợ tua xem mượt mà trên UI.
* **Chức năng 6: Playlist (Danh sách phát)**: CRUD danh sách phát trên bảng `Playlist` và thêm/xóa liên kết bài hát qua bảng trung gian `PlaylistTrack`.
* **Chức năng 7: Tìm kiếm & Khám phá (Search & Discovery)**: Tìm kiếm đồng thời trên 3 bảng `MediaItem`, `Artist`, `Playlist` theo từ khóa phân trang bằng Dapper.
* **Chức năng 8: Chia sẻ Media (Media Share)**: Ghi nhận giao dịch chia sẻ vào bảng `MediaShare`, tạo thông báo và đẩy thời gian thực qua SignalR.
* **Chức năng 9: Thông báo (Real-time Notifications)**: Truy xuất danh sách thông báo chưa đọc và cập nhật cột `IsRead = 1` sau khi xem thông báo.
* **Chức năng 10: Tương tác & Lịch sử (Interaction & History)**: Thả tim lưu vào bảng `Favorite` và lấy ra 10 bài hát nghe gần đây nhất từ bảng `PlayHistory`.

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
