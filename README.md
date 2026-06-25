# TuneVault - Hướng dẫn chạy local, Connection String và tài khoản seed

Tài liệu này hướng dẫn cách chạy project TuneVault trên máy local, cấu hình database SQL Server, connection string và cách xử lý tài khoản seed.

---

## 1. Yêu cầu cài đặt

Trước khi chạy project, cần cài:

- .NET SDK
- SQL Server hoặc SQL Server Express
- SQL Server Management Studio (SSMS)
- Node.js
- Visual Studio Code hoặc Visual Studio

---

## 2. Cấu trúc project liên quan

Ví dụ thư mục project:

```txt
CSharp
```

Backend nằm ở:

```txt
Backend\DockerFile
```

Frontend nằm ở:

```txt
Frontend
```

File tạo bảng database:

```txt
Backend\DockerFile\TuneVault.Infrastructure\Data\CreateTable.sql
```

File tạo dữ liệu mẫu:

```txt
Backend\DockerFile\TuneVault.Infrastructure\Data\CreateData.sql
```

---

## 3. Clone repository
```bash
git clone https://github.com/winnterrne/CSharp.git
cd CSharp
```
## 4. Tạo database

Mở SQL Server Management Studio (SSMS), tạo database:

```sql
CREATE DATABASE TuneVault;
GO
```

Sau đó chọn database `TuneVault` rồi chạy script theo đúng thứ tự:

```txt
1. CreateTable.sql
2. CreateData.sql
```

Lưu ý: `CreateTable.sql` phải chạy trước để tạo bảng. `CreateData.sql` chạy sau để thêm dữ liệu mẫu.

---

## 5. Connection String

Mở file cấu hình backend, ví dụ:

```txt
TuneVault.API\appsettings.json
```

hoặc:

```txt
TuneVault.API\appsettings.Development.json
```

Cấu hình connection string như sau:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TuneVault;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

---

<<<<<<< HEAD
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
=======
## 6. Cấu hình JWT

Trong `appsettings.json` cần có cấu hình JWT, ví dụ:

```json
{
  "Jwt": {
    "Key": "THIS_IS_A_SECRET_KEY_FOR_TUNEVAULT_PROJECT_123456",
    "Issuer": "TuneVaultAPI",
    "Audience": "TuneVaultClient"
  }
}
```

`Jwt:Key` phải đủ dài để tạo token. Nếu thiếu key, backend có thể lỗi khi đăng nhập.

---

## 7. Chạy backend
```bash
cd Backend\DockerFile\TuneVault.API
dotnet run
```

Sau khi chạy thành công, backend sẽ chạy ở địa chỉ tương tự:

```txt
http://localhost:5081
```
---

## 8. Chạy frontend
Mở terminal tại thư mục frontend:

```bash
cd Frontend
```

Cài package nếu chưa cài:

```bash
npm install
```

Chạy frontend:

```bash
npm run dev
```

Frontend thường chạy tại:

```txt
http://localhost:5173
```

---

## 9. Tài khoản seed và lưu ý mật khẩu

Các tài khoản seed có trong database dùng để test đăng nhập.

| UserID | Username | Email | Password |
|---|---|---|---|
| U1 | khanhdang | khanhdang@gmail.com | 123456 |
| U2 | vietduc | vietduc@gmail.com | 123456 |
| U3 | thanhnhan | thanhnhan@gmail.com | 123456 |
| U4 | ngocvinh | ngocvinh@gmail.com | 123456 |

Lưu ý quan trọng: mật khẩu trong database phải là mật khẩu đã được backend băm, không nên lưu plain text `123456` nếu code login đang kiểm tra bằng hash.



### Tạo user bằng chức năng Register

Chạy backend bằng:

```bash
dotnet run
```

Sau đó chạy frontend:

```bash
npm run dev
```

Vào trang Register và đăng ký các tài khoản seed. Khi đăng ký qua backend, mật khẩu sẽ được hash đúng theo logic của project.

Sau khi đã có user trong bảng `AspNetUsers`, mới chạy hoặc thêm tiếp dữ liệu seed liên quan như Artist, Album, MediaItem, Playlist, Favorite, PlayHistory, MediaShare, Notification.

---

## 10. Thứ tự setup

Thứ tự chạy an toàn nhất:

```txt
1. Tạo database TuneVault
2. Chạy CreateTable.sql để tạo bảng
3. Chạy backend bằng dotnet run
4. Chạy frontend bằng npm run dev
5. Đăng ký tài khoản seed bằng trang Register hoặc API Register
6. Sau khi user đã có trong database, chạy CreateData.sql để thêm dữ liệu mẫu còn lại. Nếu CreateData.sql có phần insert AspNetUsers bằng password thường, hãy bỏ qua phần insert user đó.
7. Đăng nhập bằng tài khoản seed và test chức năng
```

Nếu `CreateData.sql` đã bao gồm cả user, thì phải đảm bảo password trong file đó là password đã băm.

---

## 11. API test đăng ký và đăng nhập

### Register

```http
POST http://localhost:5081/api/Auth/register
Content-Type: application/json
```

Body:

```json
{
  "userName": "khanhdang",
  "email": "khanhdang@gmail.com",
  "password": "123456",
  "phone": "0901234567"
}
```

### Login

```http
POST http://localhost:5081/api/Auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "khanhdang@gmail.com",
  "password": "123456"
}
```

Khi đăng nhập thành công, backend trả về token JWT. Frontend lưu token này để gọi các API cần đăng nhập.

---


## 12. Lỗi thường gặp

### Lỗi connection string

Kiểm tra lại `Server`, `Database`, và `TrustServerCertificate=True`.

### Login thất bại dù đúng email/password

Nguyên nhân thường gặp là password trong database đang là plain text, trong khi backend kiểm tra password đã hash.

Cách xử lý: tạo tài khoản bằng Register thay vì insert tay mật khẩu thường.

>>>>>>> Nhanbranch
