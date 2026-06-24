using System;
using System.IO;
using Xceed.Document.NET;
using Xceed.Words.NET;

namespace DocGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            string outputPath = @"C:\Users\ADMIN\.gemini\antigravity\scratch\TuneVault\TuneVault_BaoCao.docx";
            Console.WriteLine("Dang tao bao cao tai: " + outputPath);

            using (DocX doc = DocX.Create(outputPath))
            {
                // ==================== TRANG BÌA (COVER PAGE) ====================
                // Tên trường / Bộ môn
                Paragraph school = doc.InsertParagraph("ĐỒ ÁN PHÁT TRIỂN ỨNG DỤNG WEB CÔNG NGHỆ CAO");
                school.Alignment = Alignment.center;
                school.FontSize(13).Bold().Font(new Font("Times New Roman")).SpacingAfter(10);

                Paragraph subject = doc.InsertParagraph("BÁO CÁO PHÂN TÍCH HỆ THỐNG VÀ KIẾN TRÚC PHẦN MỀM");
                subject.Alignment = Alignment.center;
                subject.FontSize(14).Bold().Font(new Font("Times New Roman")).SpacingAfter(80);

                // Tên Đề Tài
                Paragraph titleProj = doc.InsertParagraph("ĐỀ TÀI: DỰ ÁN TUNEVAULT");
                titleProj.Alignment = Alignment.center;
                titleProj.FontSize(24).Bold().Font(new Font("Times New Roman")).SpacingAfter(10);

                Paragraph subTitle = doc.InsertParagraph("HỆ THỐNG STREAMING NHẠC VÀ VIDEO TRỰC TUYẾN TÍCH HỢP TRÍ TUỆ NHÂN TẠO");
                subTitle.Alignment = Alignment.center;
                subTitle.FontSize(13).Italic().Font(new Font("Times New Roman")).SpacingAfter(150);

                // Thông tin sinh viên thực hiện
                Paragraph studentInfo = doc.InsertParagraph();
                studentInfo.Alignment = Alignment.left;
                studentInfo.Font(new Font("Times New Roman")).FontSize(12).SpacingAfter(5);
                studentInfo.AppendLine("Sinh viên thực hiện: ").Bold().Append("Đặng Khánh");
                studentInfo.AppendLine("Nhánh phát triển chính: ").Bold().Append("DangKhanh");
                studentInfo.AppendLine("Công nghệ Backend: ").Bold().Append(".NET 10 Web API, MediatR, Dapper");
                studentInfo.AppendLine("Công nghệ Frontend: ").Bold().Append("React SPA (TypeScript), Tailwind CSS");
                studentInfo.AppendLine("Hệ cơ sở dữ liệu: ").Bold().Append("Microsoft SQL Server");

                // Nơi thực hiện & Thời gian
                Paragraph dateInfo = doc.InsertParagraph("Thành phố Hồ Chí Minh, Tháng 6 Năm 2026");
                dateInfo.Alignment = Alignment.center;
                dateInfo.FontSize(11).Font(new Font("Times New Roman")).SpacingBefore(120);

                // Ngắt trang sang nội dung chính
                doc.InsertSectionPageBreak();

                // ==================== NỘI DUNG CHÍNH (CONTENT) ====================

                // CHƯƠNG 1: GIỚI THIỆU CHUNG
                InsertHeading1(doc, "CHƯƠNG 1: GIỚI THIỆU TỔNG QUAN VỀ HỆ THỐNG TUNEVAULT");
                
                InsertParagraph(doc, "TuneVault là một hệ thống web streaming đa phương tiện hiện đại (âm nhạc và video) được thiết kế nhằm mang lại trải nghiệm giải trí mượt mà, trực quan và cá nhân hóa cho người dùng. Trong thời đại số hóa hiện nay, các nền tảng streaming như Spotify, YouTube hay Netflix đòi hỏi tính tương tác thời gian thực cao, khả năng truyền tải dữ liệu dung lượng lớn với độ trễ thấp, và đặc biệt là tích hợp trí tuệ nhân tạo (AI) để nâng cao trải nghiệm người dùng.");

                InsertParagraph(doc, "Hệ thống TuneVault được phát triển toàn diện cả về mặt Backend lẫn Frontend, áp dụng các chuẩn kiến trúc công nghệ tiên tiến nhất hiện nay. Dự án giải quyết các bài toán kỹ thuật cốt lõi bao gồm: xác thực người dùng an toàn, quản lý các tệp tin đa phương tiện dung lượng lớn, chia sẻ nội dung giữa những người dùng, gửi thông báo thời gian thực qua cơ chế Push WebSocket (SignalR), và tự động hóa việc phân tích, gợi ý bài hát cá nhân hóa thông qua việc tích hợp API Gemini AI từ Google.");

                InsertParagraph(doc, "Về mặt công nghệ, hệ thống sử dụng kiến trúc phân tầng Clean Architecture trên nền tảng .NET 10 Web API ở Backend, kết hợp với thư viện Dapper để tương tác với SQL Server đạt hiệu năng tối ưu nhất. Ở Frontend, ứng dụng được xây dựng như một ứng dụng đơn trang (Single Page Application - SPA) bằng React, TypeScript, và Tailwind CSS, mang đến một giao diện tối giản, hiện đại và phản hồi nhanh nhạy trên mọi thiết bị.");

                // CHƯƠNG 2: KIẾN TRÚC PHẦN MỀM (CLEAN ARCHITECTURE)
                InsertHeading1(doc, "CHƯƠNG 2: PHÂN TÍCH KIẾN TRÚC PHẦN MỀM HỆ THỐNG");
                
                InsertParagraph(doc, "Hệ thống Backend của TuneVault được tổ chức chặt chẽ theo mô hình Clean Architecture (Kiến trúc sạch). Đây là một mô hình thiết kế phần mềm chia ứng dụng thành các lớp độc lập, hướng trọng tâm vào Logic nghiệp vụ (Domain Logic) thay vì phụ thuộc vào các công nghệ bên ngoài như Cơ sở dữ liệu hay Framework giao diện. Sự phân tách này giúp hệ thống dễ dàng bảo trì, mở rộng và viết unit test.");

                InsertHeading2(doc, "2.1. Phân tích chi tiết các tầng kiến trúc (Layers)");
                
                InsertParagraph(doc, "Kiến trúc Backend của TuneVault bao gồm 4 tầng cốt lõi, phụ thuộc từ ngoài vào trong theo quy tắc Dependency Rule:");

                InsertParagraph(doc, "• Lớp Domain (TuneVault.Domain): Đây là trung tâm của kiến trúc, chứa các thực thể nghiệp vụ (Entities) như User, MediaItem, Playlist, Artist, Notification, Favorite, Follow, MediaShare. Lớp này định nghĩa các cấu trúc dữ liệu cơ bản và các Interface của Repository (ví dụ: IMediaItemRepository, IUserRepository). Lớp Domain hoàn toàn độc lập, không phụ thuộc vào bất kỳ thư viện hay cơ sở dữ liệu nào.");

                InsertParagraph(doc, "• Lớp Application (TuneVault.Application): Chứa logic nghiệp vụ ứng dụng, định nghĩa các luồng xử lý (Use Cases). Tầng này triển khai mô hình CQRS (Command Query Responsibility Segregation) thông qua MediatR. Mỗi luồng công việc được phân tách rõ ràng thành Command (ghi dữ liệu) hoặc Query (đọc dữ liệu) kèm theo Handler tương ứng. Ngoài ra, lớp này chứa các Data Transfer Objects (DTOs), các bộ kiểm tra hợp lệ dữ liệu (FluentValidation), và các Service Interface.");

                InsertParagraph(doc, "• Lớp Infrastructure (TuneVault.Infrastructure): Cung cấp các công nghệ và dịch vụ bên ngoài để phục vụ cho các tầng bên trong. Tầng này chịu trách nhiệm tương tác trực tiếp với SQL Server bằng Dapper (triển khai thông qua lớp DataContextDapper), quản lý tệp tin vật lý trên đĩa cứng (FileStorageService), triển khai dịch vụ thông báo thời gian thực bằng SignalR (NotificationHub), và tích hợp API trí tuệ nhân tạo Gemini AI.");

                InsertParagraph(doc, "• Lớp API / Presentation (TuneVault.API): Lớp giao tiếp với thế giới bên ngoài. Lớp này chứa các Controller định nghĩa các API Endpoint (RESTful API), xử lý xác thực người dùng bằng JWT Middleware, cấu hình Dependency Injection toàn hệ thống, và quản lý các Middleware xử lý lỗi (ExceptionMiddleware).");

                // Thêm bảng tóm tắt các tầng
                Paragraph tblTitle = doc.InsertParagraph("Bảng 2.1: Bảng phân tích nhiệm vụ và các thành phần của các lớp trong Clean Architecture");
                tblTitle.FontSize(11).Bold().Font(new Font("Times New Roman")).SpacingAfter(5);
                
                Table tableLayers = doc.AddTable(5, 3);
                tableLayers.Design = TableDesign.LightShading;
                tableLayers.Rows[0].Cells[0].Paragraphs[0].Append("Tầng Lớp (Layer)").Bold();
                tableLayers.Rows[0].Cells[1].Paragraphs[0].Append("Công nghệ / Thư viện chính").Bold();
                tableLayers.Rows[0].Cells[2].Paragraphs[0].Append("Vai trò cốt lõi").Bold();

                tableLayers.Rows[1].Cells[0].Paragraphs[0].Append("TuneVault.Domain");
                tableLayers.Rows[1].Cells[1].Paragraphs[0].Append("C# Core, No Libraries");
                tableLayers.Rows[1].Cells[2].Paragraphs[0].Append("Định nghĩa Entities, interfaces Repository");

                tableLayers.Rows[2].Cells[0].Paragraphs[0].Append("TuneVault.Application");
                tableLayers.Rows[2].Cells[1].Paragraphs[0].Append("MediatR, FluentValidation");
                tableLayers.Rows[2].Cells[2].Paragraphs[0].Append("Xử lý Use Case, CQRS Handlers, DTO, Validation");

                tableLayers.Rows[3].Cells[0].Paragraphs[0].Append("TuneVault.Infrastructure");
                tableLayers.Rows[3].Cells[1].Paragraphs[0].Append("Dapper, SqlClient, SignalR, HttpClient");
                tableLayers.Rows[3].Cells[2].Paragraphs[0].Append("Kết nối DB, lưu trữ file, real-time push, API AI Client");

                tableLayers.Rows[4].Cells[0].Paragraphs[0].Append("TuneVault.API");
                tableLayers.Rows[4].Cells[1].Paragraphs[0].Append("ASP.NET Core Web API, JWT");
                tableLayers.Rows[4].Cells[2].Paragraphs[0].Append("Định nghĩa endpoint, Middleware, Authorization");

                doc.InsertTable(tableLayers);
                doc.InsertParagraph().SpacingAfter(15);

                InsertHeading2(doc, "2.2. Triển khai mẫu thiết kế CQRS và MediatR");
                
                InsertParagraph(doc, "TuneVault sử dụng cơ chế MediatR để hiện thực hóa mẫu kiến trúc CQRS. Khi một HTTP Request gửi đến API Controller, thay vì gọi trực tiếp một Service hay Repository, Controller sẽ đóng gói dữ liệu đầu vào thành một Object (Command hoặc Query) và gửi đi thông qua Mediator. Mediator tự động định tuyến Command/Query đó đến đúng Handler tương ứng để xử lý.");

                InsertParagraph(doc, "Đặc biệt, hệ thống áp dụng cơ chế Pipeline Behavior (ValidationBehavior) của MediatR để tự động kiểm tra tính hợp lệ của dữ liệu đầu vào. Trước khi đi vào Handler để thực thi logic nghiệp vụ, mọi Command sẽ được đi qua FluentValidation để kiểm tra (ví dụ: kiểm tra định dạng email, kiểm tra độ dài bài hát, kiểm tra sự tồn tại của file). Nếu phát hiện lỗi dữ liệu, Exception sẽ được ném ra ngay lập tức và được xử lý tập trung tại ExceptionMiddleware để trả về mã lỗi HTTP 400 Bad Request cho Client, giúp giữ cho code trong các Handler cực kỳ ngắn gọn và tập trung hoàn toàn vào Business Logic.");

                // CHƯƠNG 3: SO SÁNH LỰA CHỌN EF CORE VÀ DAPPER
                InsertHeading1(doc, "CHƯƠNG 3: SO SÁNH VÀ LỰA CHỌN CÔNG NGHỆ TƯƠNG TÁC CƠ SỞ DỮ LIỆU");
                
                InsertParagraph(doc, "Trong quá trình xây dựng hệ thống phần mềm sử dụng C# và .NET, việc lựa chọn ORM (Object-Relational Mapper) để giao tiếp với Cơ sở dữ liệu luôn là một quyết định kiến trúc quan trọng. Dự án TuneVault đã lựa chọn và triển khai hoàn toàn tầng dữ liệu dựa trên thư viện Dapper thay vì sử dụng Entity Framework Core (EF Core), mặc dù package EF Core SqlServer vẫn được khai báo sẵn để đề phòng nhu cầu tích hợp Hybrid sau này.");

                InsertHeading2(doc, "3.1. So sánh chi tiết các đặc tính công nghệ");
                
                InsertParagraph(doc, "EF Core là một ORM đầy đủ tính năng (Full-blown ORM) cung cấp khả năng tự động sinh mã SQL, theo dõi trạng thái thay đổi của thực thể (Change Tracking), di cư cơ sở dữ liệu (Migrations) và làm việc trực tiếp với LINQ. Ngược lại, Dapper là một Micro-ORM tối giản, chỉ cung cấp khả năng map trực tiếp kết quả truy vấn SQL thô (Raw SQL) thành các Object C# một cách nhanh chóng.");

                InsertParagraph(doc, "Bảng dưới đây tóm tắt các điểm khác biệt cốt lõi giữa hai công nghệ này:");

                Table tableComparison = doc.AddTable(6, 3);
                tableComparison.Design = TableDesign.LightShading;
                tableComparison.Rows[0].Cells[0].Paragraphs[0].Append("Tiêu chí so sánh").Bold();
                tableComparison.Rows[0].Cells[1].Paragraphs[0].Append("Entity Framework Core (EF Core)").Bold();
                tableComparison.Rows[0].Cells[2].Paragraphs[0].Append("Dapper (Micro-ORM)").Bold();

                tableComparison.Rows[1].Cells[0].Paragraphs[0].Append("Hiệu năng thực thi");
                tableComparison.Rows[1].Cells[1].Paragraphs[0].Append("Trung bình - Chậm hơn do overhead của việc dịch LINQ, tạo tracking cache.");
                tableComparison.Rows[1].Cells[2].Paragraphs[0].Append("Rất nhanh - Tương đương với việc sử dụng SqlDataReader thuần của ADO.NET.");

                tableComparison.Rows[2].Cells[0].Paragraphs[0].Append("Quản lý câu lệnh SQL");
                tableComparison.Rows[2].Cells[1].Paragraphs[0].Append("Tự động sinh SQL (Lập trình viên không cần viết SQL thô).");
                tableComparison.Rows[2].Cells[2].Paragraphs[0].Append("Lập trình viên tự viết các truy vấn SQL thô trong mã nguồn.");

                tableComparison.Rows[3].Cells[0].Paragraphs[0].Append("Hỗ trợ Query phức tạp (Join)");
                tableComparison.Rows[3].Cells[1].Paragraphs[0].Append("Có thể sinh ra SQL rất phức tạp và không tối ưu khi thực hiện các lệnh Join lồng nhau.");
                tableComparison.Rows[3].Cells[2].Paragraphs[0].Append("Tối ưu hóa tối đa vì lập trình viên có thể viết các câu lệnh SELECT JOIN trực tiếp.");

                tableComparison.Rows[4].Cells[0].Paragraphs[0].Append("Quản lý Bộ nhớ (Memory)");
                tableComparison.Rows[4].Cells[1].Paragraphs[0].Append("Tốn nhiều bộ nhớ do duy trì Change Tracker cho hàng ngàn bản ghi.");
                tableComparison.Rows[4].Cells[2].Paragraphs[0].Append("Cực kỳ tiết kiệm bộ nhớ, dữ liệu được ánh xạ trực tiếp và giải phóng ngay lập tức.");

                tableComparison.Rows[5].Cells[0].Paragraphs[0].Append("Tốc độ phát triển ban đầu");
                tableComparison.Rows[5].Cells[1].Paragraphs[0].Append("Nhanh nhờ khả năng tự động tạo bảng, CRUD tự động.");
                tableComparison.Rows[5].Cells[2].Paragraphs[0].Append("Chậm hơn một chút vì phải viết tay các câu lệnh SQL INSERT/UPDATE.");

                doc.InsertTable(tableComparison);
                doc.InsertParagraph().SpacingAfter(15);

                InsertHeading2(doc, "3.2. Lý do TuneVault quyết định lựa chọn Dapper làm ORM chính");
                
                InsertParagraph(doc, "Lý do lựa chọn Dapper cho dự án TuneVault hoàn toàn dựa trên các yêu cầu phi chức năng cụ thể của một ứng dụng Streaming:");

                InsertParagraph(doc, "1. Hiệu năng đọc dữ liệu vượt trội: Ứng dụng streaming yêu cầu tốc độ truy xuất thông tin bài hát, video và lịch sử nghe cực kỳ nhanh chóng. Việc loại bỏ hoàn toàn cơ chế Change Tracking của EF Core giúp Dapper đạt tốc độ truy xuất tối ưu, giảm thiểu độ trễ phản hồi API.");

                InsertParagraph(doc, "2. Khả năng viết SQL Join tùy biến cao: Trong TuneVault, khi thực hiện lấy thông tin chi tiết một MediaItem, chúng ta cần Join nhiều bảng như Artist, Album, AspNetUsers. Trong Dapper, lập trình viên có thể viết trực tiếp câu lệnh SELECT và ánh xạ các trường như ArtistName, ArtistImage và AlbumName trực tiếp vào MediaItem entity (như đã thiết kế trong ERD). Điều này giúp tránh hiện tượng 'N+1 Query' thường gặp ở EF Core.");

                InsertParagraph(doc, "3. Tự chủ trong tối ưu hóa SQL: Lập trình viên có thể chủ động viết các câu lệnh chèn dữ liệu nâng cao như 'INSERT INTO ... OUTPUT INSERTED.ID' để lấy trực tiếp khóa chính tự tăng của SQL Server trong một phiên làm việc, tối giản hóa số lượng Roundtrip đến database.");

                // CHƯƠNG 4: MÔ TẢ CHI TIẾT 10 CHỨC NĂNG CỐT LÕI
                InsertHeading1(doc, "CHƯƠNG 4: THIẾT KẾ VÀ MÔ TẢ CHI TIẾT 10 CHỨC NĂNG HỆ THỐNG");
                
                InsertParagraph(doc, "Dưới đây là phần mô tả chi tiết về cách thiết kế, luồng xử lý dữ liệu và cách hiện thực hóa mã nguồn của 10 chức năng tiêu biểu trong hệ thống TuneVault.");

                // Chức năng 1
                InsertHeading2(doc, "4.1. Chức năng 1: Xác thực người dùng (Authentication - Register & Login)");
                InsertParagraph(doc, "• Mô tả: Người dùng có thể đăng ký tài khoản mới và đăng nhập vào hệ thống. Hệ thống sẽ phát hành mã JWT Token chứa thông tin định danh (User ID, Email, Role) để Frontend gửi kèm trong các request tiếp theo.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: Client gửi email và mật khẩu qua HTTP POST. Hệ thống định tuyến qua LoginCommandHandler. Lớp handler gọi UserRepository.GetUserByEmailAsync() sử dụng Dapper để truy vấn: 'SELECT * FROM AspNetUsers WHERE Email = @Email'. Khi nhận được bản ghi người dùng, handler sử dụng thư viện BCrypt.Net để xác thực mật khẩu. Nếu trùng khớp, hệ thống tạo JWT Token bằng JwtSecurityTokenHandler chứa các Claims và trả về LoginResponseDto.");

                // Chức năng 2
                InsertHeading2(doc, "4.2. Chức năng 2: Tải lên phương tiện đa phương tiện (Upload MediaItem)");
                InsertParagraph(doc, "• Mô tả: Nghệ sĩ hoặc người dùng có thể tải lên các file âm thanh (.mp3, .wav) hoặc file video (.mp4, .webm) kèm theo tiêu đề, mô tả, ảnh thumbnail.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: HTTP POST request mang định dạng Multipart Form-data chứa file và metadata được API nhận dạng qua UploadMediaCommand. Luồng validator (UploadMediaValidator) kiểm tra định dạng đuôi file và kích thước tệp tối đa (ví dụ: tối đa 20MB cho audio và 100MB cho video). UploadMediaHandler gọi FileStorageService để ghi luồng dữ liệu file (OpenReadStream) vật lý lên đĩa cứng và trả về đường dẫn tệp. Sau đó, nó tạo một đối tượng MediaItem và gọi MediaItemRepository.CreateMediaAsync() để thực thi câu lệnh SQL INSERT bằng Dapper.");

                // Chức năng 3
                InsertHeading2(doc, "4.3. Chức năng 3: Phát nhạc và Truyền phát Video (Media Playback & Video Streaming)");
                InsertParagraph(doc, "• Mô tả: Cho phép Frontend phát nhạc trực tuyến mượt mà và stream video hiệu quả mà không cần tải toàn bộ tệp về máy.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: API Endpoint '/api/media/stream/{id}' nhận yêu cầu từ thẻ audio/video của React SPA. API Controller đọc filePath từ DB qua repository, sau đó sử dụng FileStreamResult của ASP.NET Core để trả về một luồng Stream dữ liệu hỗ trợ Range Request (HTTP Range 206). Điều này cho phép trình duyệt có thể tua nhanh đến bất kỳ thời điểm nào của bài hát hoặc video một cách mượt mà.");

                // Chức năng 4
                InsertHeading2(doc, "4.4. Chức năng 4: Chia sẻ bài hát và danh sách phát (Share Media/Playlist)");
                InsertParagraph(doc, "• Mô tả: Người dùng có thể gửi chia sẻ một bài hát hoặc toàn bộ playlist cho người dùng khác trong hệ thống.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: Client gửi HTTP POST mang ShareMediaCommand. Handler kiểm tra tính hợp lệ của ReceiverID và MediaItemID bằng Dapper. Sau đó nó gọi ShareRepository.CreateShareMediaAsync() để ghi nhận bản ghi vào bảng MediaShare. Đồng thời, một bản ghi thông báo mới được chèn vào bảng Notification, và hệ thống gọi SignalR Notification Hub để đẩy thông báo thời gian thực đến Client người nhận.");

                // Chức năng 5
                InsertHeading2(doc, "4.5. Chức năng 5: Thông báo đẩy thời gian thực (Real-time Push Notifications)");
                InsertParagraph(doc, "• Mô tả: Khi người dùng được chia sẻ nhạc hoặc được người khác nhấn theo dõi (Follow), một thông báo lập tức xuất hiện trên màn hình Client mà không cần tải lại trang.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: Lớp NotificationHub kế thừa Hub của SignalR được đăng ký tại API layer. Khi các Handler xử lý thành công nghiệp vụ (như Follow hay Share), hệ thống sẽ tiêm (Inject) INotificationPushService và gọi SendNotificationAsync(userID, notification). Dịch vụ này sử dụng IHubContext<NotificationHub> để định vị kết nối websocket của userID và gọi phương thức 'ReceiveNotification' trên Client để truyền đối tượng NotificationDto sang React Frontend.");

                // Chức năng 6
                InsertHeading2(doc, "4.6. Chức năng 6: Quản lý danh sách phát (Playlist Management)");
                InsertParagraph(doc, "• Mô tả: Người dùng có thể tạo danh sách phát, đặt chế độ công khai (Public) hoặc riêng tư (Private), và thêm hoặc xóa các bài hát khỏi danh sách phát.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: Sử dụng MediatR để quản lý các lệnh CreatePlaylistCommand, AddTrackToPlaylistCommand, RemoveTrackFromPlaylistCommand. Các CommandHandler thực thi câu lệnh SQL trực tiếp qua Dapper tương tác với bảng Playlist và bảng trung gian PlaylistTrack (ví dụ: 'INSERT INTO PlaylistTrack (PlaylistID, MediaItemID) VALUES (@PlaylistID, @MediaItemID)').");

                // Chức năng 7
                InsertHeading2(doc, "4.7. Chức năng 7: Yêu thích và Tương tác (Favorite/Like Media)");
                InsertParagraph(doc, "• Mô tả: Người dùng có thể đánh dấu yêu thích một bài hát hoặc video (thả tim) để lưu trữ trong thư viện cá nhân.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: Lệnh ToggleFavoriteCommand gửi cặp khóa (UserID, MediaItemID). Handler kiểm tra xem bản ghi đã tồn tại trong bảng Favorite hay chưa qua Dapper. Nếu chưa, thực hiện câu lệnh 'INSERT INTO Favorite VALUES (@UserID, @MediaItemID)'. Nếu đã tồn tại, thực hiện câu lệnh 'DELETE FROM Favorite WHERE UserID = @UserID AND MediaItemID = @MediaItemID'.");

                // Chức năng 8
                InsertHeading2(doc, "4.8. Chức năng 8: Ghi nhận Lịch sử nghe nhạc (Play History Tracking)");
                InsertParagraph(doc, "• Mô tả: Hệ thống tự động lưu trữ thông tin về thời điểm và tệp tin đa phương tiện người dùng đã nghe/xem để theo dõi hoạt động nghe nhạc cá nhân.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: Khi bài hát phát được trên 10 giây ở Frontend, một yêu cầu HTTP POST được gửi tới API endpoint để chèn bản ghi vào bảng PlayHistory. Dapper thực thi truy vấn: 'INSERT INTO PlayHistory (UserID, MediaItemID, PlayedAt) VALUES (@UserID, @MediaItemID, GETUTCDATE())'. Dữ liệu lịch sử nghe này sẽ là đầu vào quan trọng cho giải thuật gợi ý bằng AI.");

                // Chức năng 9
                InsertHeading2(doc, "4.9. Chức năng 9: Đề xuất âm nhạc bằng trí tuệ nhân tạo (AI Music Recommendations)");
                InsertParagraph(doc, "• Mô tả: Hệ thống tự động đề xuất 5 bài hát phù hợp nhất với sở thích của người dùng dựa trên danh sách các bài hát họ yêu thích và lịch sử nghe gần đây.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: GetRecommendationsQueryHandler truy xuất danh sách bài hát người dùng đã nghe và các bài hát yêu thích thông qua InteractionRepository. Handler cũng lấy danh sách tất cả các bài hát đang có trên hệ thống. Sau đó, nó tổng hợp dữ liệu thành một Prompt tiếng Việt chi tiết gửi đến dịch vụ IAIService (tích hợp API Gemini AI). Gemini AI sẽ phân tích gu âm nhạc của người dùng và trả về danh sách 5 tên bài hát đề xuất. Hệ thống phân tách kết quả, truy vấn thông tin chi tiết bài hát bằng Dapper và trả về MediaItemRecommendationDto cho Frontend.");

                // Chức năng 10
                InsertHeading2(doc, "4.10. Chức năng 10: Tự động tạo mô tả bài hát bằng AI (AI Description Generation)");
                InsertParagraph(doc, "• Mô tả: Hệ thống tự động phân tích và tạo ra một văn bản mô tả nghệ thuật và cảm thụ âm nhạc ngắn gọn cho bài hát mới được tải lên.");
                InsertParagraph(doc, "• Luồng xử lý kỹ thuật: Sau khi bài hát tải lên thành công, GenerateMediaDescriptionCommand được kích hoạt. Handler gửi thông tin bao gồm tiêu đề bài hát, thể loại (tag), tên nghệ sĩ và mô tả ban đầu tới Gemini AI. AI sẽ phân tích và trả về một bài đánh giá cảm nhận âm nhạc ngắn (khoảng 100 chữ). Nội dung mô tả nghệ thuật này sẽ được lưu ngược lại vào trường Description của bản ghi MediaItem trong cơ sở dữ liệu để hiển thị trên giao diện nghe nhạc.");

                // CHƯƠNG 5: KHÓ KHĂN VÀ GIẢI PHÁP XỬ LÝ
                InsertHeading1(doc, "CHƯƠNG 5: KHÓ KHĂN KỸ THUẬT VÀ PHƯƠNG ÁN XỬ LÝ");
                
                InsertParagraph(doc, "Trong quá trình thiết kế và phát triển TuneVault, đội ngũ phát triển đã đối mặt với một số thử thách kỹ thuật quan trọng. Dưới đây là mô tả chi tiết các khó khăn và phương án kỹ thuật đã được áp dụng để giải quyết triệt để.");

                InsertHeading2(doc, "5.1. Thử thách về tải lên các tệp tin đa phương tiện dung lượng lớn");
                
                InsertParagraph(doc, "• Khó khăn: Theo mặc định, máy chủ ASP.NET Core (Kestrel) giới hạn dung lượng tối đa của một request body là khoảng 30MB. Khi người dùng tải lên các video chất lượng cao (.mp4) có dung lượng lớn hơn 100MB, máy chủ sẽ lập tức từ chối kết nối và trả về lỗi HTTP 413 Payload Too Large. Ngoài ra, việc đọc toàn bộ tệp vào bộ nhớ đệm (RAM) trước khi ghi xuống ổ đĩa có thể gây ra hiện tượng tràn bộ nhớ máy chủ (Out of Memory) khi có nhiều người dùng cùng tải lên đồng thời.");
                
                InsertParagraph(doc, "• Giải pháp xử lý: Đội ngũ phát triển đã cấu hình lại giới hạn kích thước request trong file Program.cs bằng cách điều chỉnh cấu hình Kestrel và FormOptions. Đồng thời, hệ thống sử dụng cơ chế streaming file trực tiếp (Direct File Streaming) bằng cách mở luồng FileStream trực tiếp từ tệp tin gửi lên và ghi tuần tự vào đĩa cứng từng phân đoạn dữ liệu (chunks), thay vì tải toàn bộ tệp tin vào RAM.");

                InsertHeading2(doc, "5.2. Thử thách về đồng bộ hóa thông báo thời gian thực");
                
                InsertParagraph(doc, "• Khó khăn: Sử dụng kết nối SignalR (WebSocket) để đẩy thông báo yêu cầu người dùng phải đang trực tuyến (Online). Nếu người dùng A chia sẻ một bài hát cho người dùng B khi người dùng B đang ngoại tuyến (Offline), kết nối SignalR của người dùng B sẽ không khả dụng. Thông báo này sẽ bị mất nếu hệ thống chỉ truyền tin real-time đơn thuần mà không có cơ chế lưu trữ.");
                
                InsertParagraph(doc, "• Giải pháp xử lý: Áp dụng quy trình lưu trữ trước - phát sóng sau (Store-and-Forward). Khi sự kiện chia sẻ hoặc follow xảy ra, hệ thống luôn ghi một bản ghi vào bảng Notification trong cơ sở dữ liệu trước với trạng thái chưa đọc (IsRead = 0). Sau đó, hệ thống mới kiểm tra kết nối SignalR. Nếu người dùng trực tuyến, thông báo sẽ được đẩy trực tiếp. Đồng thời, khi Frontend của người dùng khởi chạy hoặc phát hiện kết nối lại mạng, nó sẽ tự động gửi yêu cầu GET tới API Controller để tải về danh sách các thông báo chưa đọc từ cơ sở dữ liệu.");

                InsertHeading2(doc, "5.3. Thử thách về độ trễ và độ tin cậy của dịch vụ Gemini AI");
                
                InsertParagraph(doc, "• Khó khăn: Việc gọi API bên ngoài (Gemini AI API) thông qua Internet thường phát sinh độ trễ lớn (có thể mất từ 2 đến 5 giây để nhận kết quả phản hồi). Ngoài ra, API này có thể gặp lỗi kết nối hoặc bị giới hạn số lượt gọi (Rate-limit) khiến nghiệp vụ tải trang đề xuất âm nhạc của người dùng bị treo hoặc bị lỗi.");
                
                InsertParagraph(doc, "• Giải pháp xử lý: Áp dụng cơ chế Fallback thuật toán nội bộ kết hợp với xử lý ngoại lệ (Exception Handling). Trong GetRecommendationsQueryHandler, toàn bộ logic gọi Gemini AI được bọc trong một khối try-catch. Nếu API AI phản hồi thành công, kết quả sẽ được sử dụng. Trong trường hợp API gặp lỗi hoặc quá thời gian phản hồi (Timeout), hệ thống sẽ tự động kích hoạt thuật toán gợi ý thay thế: tìm kiếm ngẫu nhiên 5 bài hát của nghệ sĩ được người dùng nghe nhiều nhất trong lịch sử nghe nhạc gần đây để làm kết quả đề xuất. Điều này đảm bảo tính năng gợi ý luôn hoạt động ổn định 100% đối với người dùng.");

                InsertHeading2(doc, "5.4. Khó khăn trong quản lý truy vấn phức tạp của Dapper");
                
                InsertParagraph(doc, "• Khó khăn: Vì Dapper không tự động quản lý mối quan hệ giữa các thực thể, khi cần lấy thông tin bài hát cùng với tên của Nghệ sĩ (Artist) và tên của Album, lập trình viên phải tự viết các lệnh JOIN phức tạp. Nếu cấu trúc bảng thay đổi (ví dụ: thêm trường Bio vào bảng Artist hay AspNetUsers), các chuỗi SQL thô trong code sẽ bị lỗi thời và khó phát hiện ở thời điểm biên dịch (Compile-time).");
                
                InsertParagraph(doc, "• Giải pháp xử lý: Chuẩn hóa toàn bộ câu lệnh SQL trong lớp Repository, tập hợp các truy vấn vào một nơi duy nhất. Sử dụng kỹ thuật Multi-mapping của Dapper để ánh xạ các đối tượng liên quan một cách an toàn và tự động cập nhật DTO tương ứng. Điều này giúp giảm thiểu lỗi cú pháp SQL và đảm bảo tính đồng bộ dữ liệu cao.");

                // KẾT LUẬN
                InsertHeading1(doc, "KẾT LUẬN");
                
                InsertParagraph(doc, "Báo cáo trên đã phân tích chi tiết toàn bộ thiết kế hệ thống, kiến trúc phân tầng Clean Architecture, lý do lựa chọn thư viện tương tác dữ liệu tối giản Dapper để tối ưu hóa hiệu năng, mô tả 10 chức năng cốt lõi và các giải pháp vượt qua các thử thách kỹ thuật quan trọng của dự án TuneVault.");
                
                InsertParagraph(doc, "Hệ thống TuneVault đã hiện thực hóa thành công một mô hình ứng dụng Web Streaming hiện đại, có tính mở rộng cao nhờ áp dụng mẫu thiết kế CQRS cùng MediatR, tối ưu hóa tốc độ cơ sở dữ liệu bằng Dapper, tăng cường khả năng tương tác real-time bằng SignalR và áp dụng trí tuệ nhân tạo Gemini AI để tối ưu hóa trải nghiệm cá nhân hóa của người dùng. Đây là một nền tảng vững chắc để tiếp tục phát triển thêm các tính năng cao cấp hơn trong tương lai.");

                // Lưu tài liệu
                doc.Save();
            }

            Console.WriteLine("Da tao xong bao cao!");
        }

        // Helper functions for clean code
        static void InsertHeading1(DocX doc, string text)
        {
            Paragraph p = doc.InsertParagraph(text);
            p.Heading(HeadingType.Heading1);
            p.FontSize(16).Bold().Font(new Font("Times New Roman")).SpacingBefore(20).SpacingAfter(10);
        }

        static void InsertHeading2(DocX doc, string text)
        {
            Paragraph p = doc.InsertParagraph(text);
            p.Heading(HeadingType.Heading2);
            p.FontSize(13).Bold().Font(new Font("Times New Roman")).SpacingBefore(15).SpacingAfter(8);
        }

        static void InsertParagraph(DocX doc, string text)
        {
            Paragraph p = doc.InsertParagraph(text);
            p.FontSize(12).Font(new Font("Times New Roman")).Alignment = Alignment.left;
            p.SpacingAfter(10);
        }
    }
}
