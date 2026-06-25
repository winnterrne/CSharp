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

