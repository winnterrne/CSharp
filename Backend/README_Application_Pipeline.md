# TuneVault — Application Pipeline


---

## Application Pipeline

### 1. Chi tiết 10 Application Pipelines (Chú thích chi tiết từng dòng)

Dưới đây là chi tiết luồng xử lý (Application Pipeline) của 10 chức năng hệ thống theo cấu trúc MediatR CQRS, FluentValidation và Clean Architecture.

#### 1.1. Chức năng 1: Xác thực (Authentication)
 **Đăng ký tài khoản (Register):**
```
RegisterCommand
  -> RegisterValidator             % Xác thực thông tin đầu vào (UserName, Email, Password) hợp lệ bằng FluentValidation
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động kiểm tra lỗi và ném ValidationException nếu có
  -> RegisterHandler               % Xử lý nghiệp vụ: băm mật khẩu, lưu tài khoản qua Dapper và tạo JWT Token
  -> AuthResponseDto               % Trả về DTO chứa thông tin tài khoản và chuỗi JWT Token để xác thực các request sau
```

 **Đăng nhập (Login):**
```
LoginCommand
  -> LoginValidator                % Kiểm tra định dạng Email và Password không được trống
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động xác thực dữ liệu đầu vào
  -> LoginHandler                  % Nghiệp vụ: xác thực thông tin đăng nhập trong DB, kiểm tra mật khẩu và cấp JWT Token
  -> AuthResponseDto               % Trả về DTO chứa thông tin đăng nhập và chuỗi JWT Token hợp lệ
```

#### 1.2. Chức năng 2: Hồ sơ người dùng (User Profile)
 **Xem hồ sơ người dùng:**
```
GetProfileQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (Query này không cần validator)
  -> GetProfileHandler             % Truy vấn DB qua Dapper lấy thông tin hồ sơ người dùng (UserName, Email, UserImage, Bio)
  -> UserDTO                       % Trả về DTO chứa thông tin chi tiết hồ sơ người dùng hiển thị lên giao diện
```

 **Cập nhật hồ sơ người dùng:**
```
UpdateProfileCommand
  -> UpdateProfileValidator        % Xác thực dữ liệu cập nhật (UserName không trống, định dạng ảnh đại diện hợp lệ)
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động kiểm duyệt lỗi đầu vào
  -> UpdateProfileHandler          % Nghiệp vụ: Cập nhật thông tin profile (UserName, UserImage, Bio) trong bảng AspNetUsers
  -> int                           % Trả về số dòng bị ảnh hưởng trong database (1: Thành công, 0: Thất bại)
```

#### 1.3. Chức năng 3: Thư viện Media (Media Library)
 **Tải lên tệp phương tiện (Audio/Video):**
```
UploadMediaCommand
  -> UploadMediaValidator          % Kiểm tra tiêu đề, định dạng tệp (mp3, wav, mp4) và kích thước tệp tải lên
  -> ValidationBehavior            % MediatR Pipeline Behavior kiểm duyệt dữ liệu file đính kèm và metadata
  -> UploadMediaHandler            % Nghiệp vụ: lưu file vật lý qua FileStorageService và chèn metadata vào bảng MediaItem
  -> MediaItemDto                  % Trả về thông tin chi tiết tệp phương tiện vừa được tạo thành công trong hệ thống
```

#### 1.4. Chức năng 4: Audio Player (Trình phát nhạc)
 **Truyền phát audio (HTTP Range Requests):**
```
GetMediaInfoQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> GetMediaInfoQueryHandler      % Lấy thông tin bài hát và đường dẫn vật lý tệp tin từ bảng MediaItem
  -> MediaItemDto                  % Trả về DTO chứa đường dẫn tệp để API Controller tạo luồng phát nhạc (HTTP Range Request 206)
```

 **Ghi nhận lịch sử nghe nhạc:**
```
RecordPlayHistoryCommand
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> RecordPlayHistoryHandler      % Nghiệp vụ: Thêm bản ghi mới lưu vết người dùng vừa nghe bài hát vào bảng PlayHistory
  -> int                           % Trả về số lượng dòng bị ảnh hưởng (1: Đã lưu lịch sử thành công)
```

#### 1.5. Chức năng 5: Video Player (Trình phát video)
 **Truyền phát video (HTTP Range Requests):**
```
GetMediaInfoQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> GetMediaInfoQueryHandler      % Lấy thông tin video và đường dẫn tệp video (.mp4, .webm) từ DB qua Dapper
  -> MediaItemDto                  % Trả về thông tin video phục vụ luồng truyền tải video chunk-by-chunk trên giao diện
```

#### 1.6. Chức năng 6: Playlist (Danh sách phát)
 **Tạo danh sách phát mới:**
```
CreatePlaylistCommand
  -> CreatePlaylistValidator       % Xác thực thông tin đầu vào (PlaylistName không được để trống)
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động xác thực tên playlist
  -> CreatePlaylistHandler         % Nghiệp vụ: Thực thi câu lệnh SQL INSERT tạo bản ghi mới trong bảng Playlist
  -> int                           % Trả về ID tự tăng của Playlist vừa được tạo thành công
```

 **Thêm bài hát vào danh sách phát:**
```
AddTrackToPlaylistCommand
  -> AddTrackToPlaylistValidator   % Xác thực sự tồn tại của PlaylistID và MediaItemID
  -> ValidationBehavior            % MediatR Pipeline Behavior kiểm tra tính hợp lệ của liên kết track-playlist
  -> AddTrackToPlaylistHandler     % Nghiệp vụ: Chèn bản ghi liên kết vào bảng trung gian PlaylistTrack
  -> int                           % Trả về số lượng dòng bị ảnh hưởng (1: Thêm bài hát thành công)
```

#### 1.7. Chức năng 7: Tìm kiếm & Khám phá (Search & Discovery)
 **Tìm kiếm bài hát, nghệ sĩ, playlist:**
```
SearchMediaQuery
  -> SearchMediaValidator          % Kiểm tra từ khóa tìm kiếm (SearchTerm không trống) và tham số phân trang
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động xác thực các tham số tìm kiếm
  -> SearchMediaQueryHandler       % Nghiệp vụ: Truy vấn Dapper thực hiện tìm kiếm đa bảng (MediaItem, Artist, Playlist)
  -> List<MediaItemDto>            % Trả về danh sách kết quả bài hát/video khớp với từ khóa kèm phân trang
```

#### 1.8. Chức năng 8: Chia sẻ Media (Media Share)
 **Chia sẻ bài hát hoặc playlist cho người dùng khác:**
```
ShareMediaCommand
  -> ShareMediaValidator           % Xác thực sự tồn tại của ReceiverID, MediaItemID/PlaylistID và định dạng đầu vào
  -> ValidationBehavior            % MediatR Pipeline Behavior tự động kiểm duyệt dữ liệu chia sẻ
  -> ShareMediaHandler             % Nghiệp vụ: Tạo bản ghi MediaShare, tạo thông báo mới Notification, gửi realtime qua SignalR
  -> ShareMediaResponseDto         % Trả về DTO chứa thông tin chi tiết của giao dịch chia sẻ vừa hoàn thành
```

#### 1.9. Chức năng 9: Thông báo (Real-time Notifications)
 **Lấy danh sách thông báo:**
```
GetNotificationsQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> GetNotificationsHandler       % Nghiệp vụ: Truy vấn bảng Notification lấy các thông báo của người dùng qua Dapper
  -> IEnumerable<NotificationDto>  % Trả về danh sách thông báo kèm payload chi tiết (chứa link, loại thông báo)
```

 **Đánh dấu thông báo đã đọc:**
```
MarkNotificationReadCommand
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> MarkNotificationReadHandler   % Nghiệp vụ: Cập nhật trạng thái IsRead = true cho thông báo theo ID trong DB
  -> int                           % Trả về số dòng được cập nhật thành công (1: Thành công)
```

#### 1.10. Chức năng 10: Tương tác & Lịch sử (Interaction & History)
 **Thêm bài hát vào danh sách yêu thích:**
```
AddFavoriteCommand
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> AddFavoriteHandler            % Nghiệp vụ: Chèn cặp giá trị (UserID, MediaItemID) vào bảng Favorite qua Dapper
  -> int                           % Trả về số lượng dòng bị ảnh hưởng (1: Đã thích thành công)
```

 **Lấy danh sách lịch sử nghe nhạc gần đây:**
```
GetRecentPlayHistoryQuery
  -> ValidationBehavior            % Bỏ qua FluentValidation (không cần validator)
  -> GetRecentPlayHistoryHandler   % Nghiệp vụ: Truy vấn bảng PlayHistory lấy 10 bài hát đã phát gần nhất kèm thời gian
  -> IEnumerable<PlayHistoryDTO>   % Trả về danh sách DTO thông tin 10 bài hát được nghe gần nhất của người dùng
```

### 2. Mô tả chi tiết hoạt động của từng Pipeline

Dưới đây là mô tả chi tiết quy trình xử lý, các nghiệp vụ kiểm tra và bảng dữ liệu tương tác cho từng chức năng:

 **Chức năng 1: Xác thực (Authentication)**: Đăng ký mã hóa mật khẩu và tạo tài khoản trong bảng `AspNetUsers`, cấp phát JWT Token. Đăng nhập đối chiếu mật khẩu và cấp Token phiên làm việc.
 **Chức năng 2: Hồ sơ người dùng (User Profile)**: Xem hồ sơ truy xuất thông tin từ bảng `AspNetUsers` qua Dapper. Cập nhật hồ sơ thực hiện cập nhật ảnh đại diện và bio trong database.
 **Chức năng 3: Thư viện Media (Media Library)**: Tải lên tệp tin và lưu trữ file vật lý trên máy chủ, đồng thời lưu trữ siêu dữ liệu vào bảng `MediaItem` trong DB.
 **Chức năng 4: Audio Player (Trình phát nhạc)**: Truyền phát luồng nhạc chunk-by-chunk qua HTTP 206 Range Requests, và tự động lưu vết lượt nghe vào bảng `PlayHistory`.
 **Chức năng 5: Video Player (Trình phát video)**: Truyền phát luồng video dung lượng lớn qua HTTP Range Request (206) hỗ trợ tua xem mượt mà trên UI.
 **Chức năng 6: Playlist (Danh sách phát)**: CRUD danh sách phát trên bảng `Playlist` và thêm/xóa liên kết bài hát qua bảng trung gian `PlaylistTrack`.
 **Chức năng 7: Tìm kiếm & Khám phá (Search & Discovery)**: Tìm kiếm đồng thời trên 3 bảng `MediaItem`, `Artist`, `Playlist` theo từ khóa phân trang bằng Dapper.
 **Chức năng 8: Chia sẻ Media (Media Share)**: Ghi nhận giao dịch chia sẻ vào bảng `MediaShare`, tạo thông báo và đẩy thời gian thực qua SignalR.
 **Chức năng 9: Thông báo (Real-time Notifications)**: Truy xuất danh sách thông báo chưa đọc và cập nhật cột `IsRead = 1` sau khi xem thông báo.
 **Chức năng 10: Tương tác & Lịch sử (Interaction & History)**: Thả tim lưu vào bảng `Favorite` và lấy ra 10 bài hát nghe gần đây nhất từ bảng `PlayHistory`.

---
