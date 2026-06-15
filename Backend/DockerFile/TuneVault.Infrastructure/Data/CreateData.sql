-- ─────────────────────────────────────────────
-- BƯỚC 1: DỌN DẸP (không đụng Artist)
-- ─────────────────────────────────────────────
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'


-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
-- CÁI NÀY TẠO THỦ CÔNG THÔNG QUA REGISTER
-- INSERT INTO AspNetUsers (UserID, UserName, UserImage, Email, Password, Role, Phone)
-- VALUES
--   ('U1', 'khanhdang',  'avatar_khanhdang.jpg',  'khanhdang@gmail.com',  '123456', 'User', '0901234567'),
--   ('U2', 'vietduc',   'avatar_vietduc.jpg',   'vietduc@gmail.com',   '123456', 'User', '0912345678'),
--   ('U3', 'thanhnhan',  'avatar_thanhnhan.jpg',  'thanhnhan@gmail.com',  '123456', 'User', '0923456789'),
--   ('U4', 'ngocvinh',  'avatar_ngocvinh.jpg',  'ngocvinh@gmail.com',  '123456', 'User', '0923456789');

-- ─────────────────────────────────────────────
-- ARTISTS
-- ─────────────────────────────────────────────
INSERT INTO Artist (ArtistName, ArtistImage)
VALUES
  (N'Sơn Tùng M-TP',    'artist_sontung.jpg'),      -- ID 1
  (N'Low G',          'artist_lowg.jpg'),          -- ID 2
  (N'Dangrangto',           'artist_dangrangto.jpg'),-- ID 3
  (N'HIEUTHUHAI',       'artist_hieuthuhai.jpg'),   -- ID 4
  (N'tlinh',            'artist_tlinh.jpg'),        -- ID 5
  (N'Mono',             'artist_mono.jpg'),         -- ID 6
  (N'Hoàng Thùy Linh',  'artist_htl.jpg'),          -- ID 7
  (N'GREY D',           'artist_greyd.jpg'),        -- ID 8
  (N'Obito',            'artist_obito.jpg'),        -- ID 9
  (N'Wren Evans',       'artist_wren_evans.jpg'),   -- ID 10
  (N'MCK',               'artist_mck.jpg'),         -- ID 11
  (N'Wxrdie',           'artist_wrxdie.jpg');       -- ID 12

-- ─────────────────────────────────────────────
-- ALBUMS
-- ─────────────────────────────────────────────
INSERT INTO Album (AlbumName, Title, AlbumItemImage, ReleaseDate, ArtistID, UserID)
VALUES
  (N'Nhạc Việt Đỉnh Cao', N'Top Hits Việt Nam', 'album_top_hits.jpg',     '2024-01-01', 1, 'U1'),
  (N'Rap Việt Nổi Bật',   N'Best of Rap Việt',  'album_rap_viet.jpg',      '2024-01-01', 2, 'U2'),
  (N'MV Viral',           N'Music Videos Triệu View',  'album_mv_viral.jpg',      '2024-01-01', 7, 'U3');

-- ─────────────────────────────────────────────
-- MEDIA ITEMS - Songs (AlbumID 1: Top Hits)
-- MediaItemTag: thể loại nhạc thực tế (Pop, Ballad, R&B, ...)
-- ─────────────────────────────────────────────
INSERT INTO MediaItem
  (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
    (N'Come My Way',
   'thumb_come_my_way.jpg',
   'come_my_way.mp3',
   N'Pop', 'Song', 220,
   N'Bản hit đỉnh cao của Sơn Tùng M-TP', 1, 1, 'U1'),

  (N'Có Chắc Yêu Là Đây',
   'thumb_co_chac_yeu_la_day.jpg',
   'co_chac_yeu_la_day.mp3',
   N'Pop', 'Song', 193,
   N'Bản hit đỉnh cao của Sơn Tùng M-TP', 1, 1, 'U1'),

  (N'Chúng Ta Của Hiện Tại',
   'thumb_chung_ta_cua_hien_tai.jpg',
   'chung_ta_cua_hien_tai.mp3',
   N'Ballad', 'Song', 262,
   N'Ballad xúc động về tình yêu', 1, 1, 'U1'),

  (N'Chăm Hoa',
   'thumb_cham_hoa.jpg',
   'cham_hoa.mp3',
   N'Pop', 'Song', 246,
   N'Ca khúc nổi tiếng của Mono', 6, 1, 'U2'),

  (N'Waiting For You',
   'thumb_song_waiting_for_you.jpg',
   'song_waiting_for_you.mp3',
   N'Ballad', 'Song', 230,
   N'Ca khúc nổi tiếng của Mono', 6, 1, 'U2'),

  (N'hóa ra ...',
   'thumb_hoa_ra.jpg',
   'hoa_ra.mp3',
   N'Pop', 'Song', 212,
   N'Hit của GREY D ft. tlinh', 8, 1, 'U3'),

  (N'Thu Đợi',
   'thumb_thu_doi.jpg',
   'thu_doi.mp3',
   N'Pop Ballad', 'Song', 198,
   N'Bản ballad nhẹ nhàng, da diết với nội dung về nỗi nhớ và sự chia ly', 10, 1, 'U2');

-- ─────────────────────────────────────────────
-- MEDIA ITEMS - Songs (AlbumID 2: Rap Việt)
-- ─────────────────────────────────────────────
INSERT INTO MediaItem
  (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
  (N'Tim Anh Ghen',
   'thumb_tim_anh_ghen.jpg',
   'tim_anh_ghen.mp3',
   N'Hip-Hop', 'Song', 237,
   N'Bài hát Bài hát mang năng lượng của giới trẻ hiện đại, kết hợp giữa chất gang, sự tự tin, hành trình đi lên từ khó khăn và phong cách sống của các rapper trẻ',
   12, 2, 'U1'),

   (N'Chấm Hết',
   'thumb_cham_het.jpg',
   'cham_het.mp3',
   N'Hip-Hop', 'Song', 200,
   N'Chấm Hết kể về cảm xúc sau khi một mối quan hệ tan vỡ. Nhân vật trong bài hát trải qua sự thất vọng, tổn thương và tức giận khi người mình yêu rời đi, nhưng đồng thời cũng cố tỏ ra mạnh mẽ và chấp nhận sự kết thúc của chuyện tình',
   3,2, 'U1'),

   (N'Đánh Đổi',
   'thumb_danh_doi.jpg',
   'danh_doi.mp3',
   N'Hip-Hop', 'Song', 230,
   N'Đánh Đổi kể về hành trình trưởng thành của Obito trong âm nhạc và cuộc sống. Bài hát xoay quanh những gì người nghệ sĩ phải hy sinh để theo đuổi đam mê: thời gian, tuổi trẻ, sự bình yên và cả những tổn thương tinh thần',
    9, 2, 'U2'),

    (N'Ngựa Ô',
   'thumb_ngua_o.jpg',
   'ngua_o.mp3',
   N'Hip-Hop', 'Song', 230,
   N'mang tinh thần của những người trẻ đang theo đuổi thành công từ con số không. Hình ảnh ngựa ô tượng trưng cho những người không được đánh giá cao ban đầu nhưng vẫn âm thầm vươn lên và tạo bất ngờ',
    3, 2, 'U2'),

    (N'HOP ON DA SHOW',
   'thumb_hop_on_da_show.jpg',
   'hop_on_da_show.mp3',
   N'Hip-Hop', 'Song', 180,
   N'là một bản nhạc năng lượng cao xoay quanh không khí biểu diễn, sự nổi tiếng và phong cách sống tự tin của các nghệ sĩ',
    2, 2, 'U2');
  

-- ─────────────────────────────────────────────
-- MEDIA ITEMS - Videos / MV (AlbumID 3: MV Viral)
-- ─────────────────────────────────────────────
INSERT INTO MediaItem
  (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
  (N'See Tình',
   'thumb_mv_see_tinh.jpg',
   'mv_see_tinh.mp4',
   N'Pop', 'Video', 285,
   N'MV đình đám của Hoàng Thùy Linh – triệu view', 7, 3, 'U1'),

  (N'Để Mị Nói Cho Mà Nghe',
   'thumb_mv_de_mi_noi.jpg',
   'mv_de_mi_noi.mp4',
   N'Pop / Folk Fusion', 'Video', 242,
   N'MV dân gian đương đại viral của Hoàng Thùy Linh', 7, 3, 'U2'),

  (N'Chạy Ngay Đi',
   'thumb_mv_chay_ngay_di.jpg',
   'mv_chay_ngay_di.mp4',
   N'Pop', 'Video', 250,
   N'MV huyền thoại của Sơn Tùng M-TP', 1, 3, 'U3'),

  (N'Hãy Trao Cho Anh',
   'thumb_mv_hay_trao_cho_anh.jpg',
   'mv_hay_trao_cho_anh.mp4',
   N'Pop', 'Video', 273,
   N'MV triệu view Sơn Tùng M-TP ft. Snoop Dogg. ca khúc tình yêu mang không khí mùa hè sôi động, kể về sự say mê trước một cô gái quyến rũ và mong muốn được đáp lại tình cảm', 
   1, 3, 'U1'),

  (N'Dự Báo Thời Tiết Hôm Nay Mưa',
   'thumb_du_bao_thoi_tiet_hom_nay_mua.jpg',
   'du_bao_thoi_tiet_hom_nay_mua.mp4',
   N'R&B', 'Video', 290,
   N'Ca khúc đầy sâu lắng của GREY D. Bài hát kể về tâm trạng của một chàng trai sau chia tay, khi mọi thứ xung quanh đều gợi nhớ đến người cũ', 
   8, 3, 'U2');

-- MediaItemID theo thứ tự INSERT của bạn:
--
-- AlbumID 1 – Top Hits (Songs):
--  1  Come My Way              – Sơn Tùng  (ArtistID 1)
--  2  Có Chắc Yêu Là Đây      – Sơn Tùng  (ArtistID 1)
--  3  Chúng Ta Của Hiện Tại   – Sơn Tùng  (ArtistID 1)
--  4  Chăm Hoa                – Mono      (ArtistID 6)
--  5  Waiting For You         – Mono      (ArtistID 6)
--  6  hóa ra ...              – GREY D    (ArtistID 8)
--  7  Thu Đợi                 – Wren Evans(ArtistID 10)
--
-- AlbumID 2 – Rap Việt (Songs):
--  8  Tim Anh Ghen            – Wxrdie    (ArtistID 12)
--  9  Chấm Hết                – Dangrangto(ArtistID 3)
-- 10  Đánh Đổi                – Obito     (ArtistID 9)
-- 11  Ngựa Ô                  – Dangrangto(ArtistID 3)
-- 12  HOP ON DA SHOW          – Low G     (ArtistID 2)
--
-- AlbumID 3 – MV Viral (Videos):
-- 13  See Tình               – Hoàng Thùy Linh (ArtistID 7)
-- 14  Để Mị Nói Cho Mà Nghe  – Hoàng Thùy Linh (ArtistID 7)
-- 15  Chạy Ngay Đi            – Sơn Tùng  (ArtistID 1)
-- 16  Hãy Trao Cho Anh        – Sơn Tùng  (ArtistID 1)
-- 17  Dự Báo Thời Tiết Hôm Nay Mưa – GREY D (ArtistID 8)
-- ─────────────────────────────────────────────
 

DELETE FROM Follow;
DELETE FROM Favorite;
DELETE FROM PlaylistTrack;
DELETE FROM Playlist;
DELETE FROM MediaItem;
DELETE FROM Album;

DBCC CHECKIDENT ('MediaItem', RESEED, 0);
DBCC CHECKIDENT ('Album',     RESEED, 0);
DBCC CHECKIDENT ('Playlist',  RESEED, 0);

EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'


-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
-- CÁI NÀY TẠO THỦ CÔNG THÔNG QUA REGISTER
-- INSERT INTO AspNetUsers (UserID, UserName, UserImage, Email, Password, Role, Phone, Bio)
-- VALUES
--   ('U1', 'khanhdang',  'avatar_khanhdang.jpg',  'khanhdang@gmail.com',  '123456', 'User', '0901234567', 'Sinh viên yêu thích công nghệ, âm nhạc và lập trình. Thường nghe Indie và V-Pop để thư giãn.'),
--   ('U2', 'vietduc',   'avatar_vietduc.jpg',   'vietduc@gmail.com',   '123456', 'User', '0912345678', 'Đam mê Rap Việt và Hip Hop. Luôn tìm kiếm những nghệ sĩ và bài hát mới mỗi ngày.'),
--   ('U3', 'thanhnhan',  'avatar_thanhnhan.jpg',  'thanhnhan@gmail.com',  '123456', 'User', '0923456789', 'Yêu thích những bản ballad nhẹ nhàng và nhạc chill. Âm nhạc giúp cân bằng cuộc sống.'),
--   ('U4', 'ngocvinh',  'avatar_ngocvinh.jpg',  'ngocvinh@gmail.com',  '123456', 'User', '0923456789', 'Người yêu âm nhạc đa thể loại, từ Pop, R&B đến Rap. Thích tạo playlist theo tâm trạng.');

INSERT INTO Artist (ArtistName, ArtistImage, Bio)
VALUES
  (N'Sơn Tùng M-TP',    'artist_sontung.jpg',
   N'Ca sĩ, nhạc sĩ và nhà sản xuất âm nhạc hàng đầu Việt Nam. Nổi tiếng với phong cách Pop hiện đại và nhiều bản hit đình đám.'),         -- ID 1
  (N'Low G',            'artist_lowg.jpg',
   N'Rapper trẻ nổi bật với chất nhạc độc đáo, flow linh hoạt và cá tính riêng trong làng Hip Hop Việt.'),                                  -- ID 2
  (N'Dangrangto',       'artist_dangrangto.jpg',
   N'Nghệ sĩ Indie Rap với phong cách kể chuyện chân thực, giàu cảm xúc và đậm dấu ấn cá nhân.'),                                          -- ID 3
  (N'HIEUTHUHAI',       'artist_hieuthuhai.jpg',
   N'Rapper và nghệ sĩ giải trí nổi tiếng, sở hữu nhiều bản hit cùng phong cách trình diễn cuốn hút.'),                                     -- ID 4
  (N'tlinh',            'artist_tlinh.jpg',
   N'Nữ rapper và ca sĩ R&B nổi bật với cá tính mạnh mẽ, âm nhạc hiện đại và nhiều màu sắc.'),                                             -- ID 5
  (N'Mono',             'artist_mono.jpg',
   N'Ca sĩ trẻ theo đuổi dòng nhạc Pop, sở hữu chất giọng cảm xúc và phong cách âm nhạc trẻ trung.'),                                      -- ID 6
  (N'Hoàng Thùy Linh',  'artist_htl.jpg',
   N'Ca sĩ đa tài với phong cách kết hợp giữa âm nhạc dân gian đương đại và Pop hiện đại.'),                                                -- ID 7
  (N'GREY D',           'artist_greyd.jpg',
   N'Ca sĩ, nhạc sĩ trẻ nổi bật với những bản ballad giàu cảm xúc và giai điệu dễ chạm đến người nghe. Nghệ sĩ Việt Nam được nghe nhiều nhất trên Spotify năm 2023.'), -- ID 8
  (N'Obito',            'artist_obito.jpg',
   N'Rapper thuộc thế hệ mới với phong cách gần gũi, ca từ chân thật và nhiều sản phẩm được yêu thích.'),                                   -- ID 9
  (N'Wren Evans',       'artist_wren_evans.jpg',
   N'Nghệ sĩ trẻ sáng tạo, nổi bật với phong cách Pop và R&B hiện đại cùng tư duy âm nhạc mới mẻ.'),                                       -- ID 10
  (N'MCK',              'artist_mck.jpg',
   N'Rapper tài năng với chất nhạc độc đáo, kỹ thuật tốt và dấu ấn riêng trong cộng đồng Rap Việt.'),                                      -- ID 11
  (N'Wxrdie',           'artist_wxrdie.jpg',
   N'Rapper trẻ mang màu sắc hiện đại, nổi bật với những bản rap giàu năng lượng và cá tính.'),                                             -- ID 12
  (N'Phùng Khánh Linh', 'artist_phungkhanhlinh.jpg',
   N'Ca sĩ kiêm nhạc sĩ người Việt Nam. Album thứ 3 "Giữa Một Vạn Người" (2025) pha trộn Alternative Pop, Dream Pop và Indie Rock, lấy cảm hứng từ vở ballet Hồ Thiên Nga.'); -- ID 13
 
-- ─────────────────────────────────────────────
-- BƯỚC 2: 3 ALBUMS
-- ─────────────────────────────────────────────
INSERT INTO Album (AlbumName, Title, AlbumItemImage, ReleaseDate, ArtistID, UserID)
VALUES
  (N'Sky Tour',            N'Sky Tour',            'album_sky_tour.jpg',          '2026-06-15', 1,  'U1'),  -- ID 1
  (N'ÁNH SÁNG • MÀN ĐÊM', N'ÁNH SÁNG • MÀN ĐÊM', 'album_anh_sang_man_dem.jpg',  '2026-04-05', 8,  'U2'),  -- ID 2
  (N'GIỮA MỘT VẠN NGƯỜI', N'GIỮA MỘT VẠN NGƯỜI', 'album_giua_mot_van_nguoi.jpg', '2025-10-18', 13, 'U3'); -- ID 3

 
-- ─────────────────────────────────────────────
-- BƯỚC 3: MEDIA ITEMS
--
-- Bài thuộc album:
--   Sky Tour (AlbumID 1)        → Come My Way, Có Chắc Yêu Là Đây, Chúng Ta Của Hiện Tại
--   ÁNH SÁNG • MÀN ĐÊM (ID 2) → hóa ra... + 7 bài mới
--   GIỮA MỘT VẠN NGƯỜI (ID 3)  → 12 bài mới của Phùng Khánh Linh
--
-- Bài AlbumID = NULL:
--   Chăm Hoa, Waiting For You, Thu Đợi (Mono, Wren Evans)
--   Tim Anh Ghen, Chấm Hết, Đánh Đổi, Ngựa Ô, HOP ON DA SHOW (Rap)
--   See Tình, Để Mị Nói Cho Mà Nghe, Chạy Ngay Đi,
--   Hãy Trao Cho Anh, Dự Báo Thời Tiết Hôm Nay Mưa (MV cũ)
-- ─────────────────────────────────────────────

-- Bài cũ thuộc Sky Tour
INSERT INTO MediaItem
  (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
  (N'Come My Way',
   'thumb_come_my_way.jpg', 'come_my_way.mp3',
   N'Pop', 'Song', 220,
   N'Bản hit đỉnh cao của Sơn Tùng M-TP', 1, 1, 'U1'),              -- ID 1

  (N'Có Chắc Yêu Là Đây',
   'thumb_co_chac_yeu_la_day.jpg', 'co_chac_yeu_la_day.mp3',
   N'Pop', 'Song', 193,
   N'Bản hit đỉnh cao của Sơn Tùng M-TP', 1, 1, 'U1'),              -- ID 2

  (N'Chúng Ta Của Hiện Tại',
   'thumb_chung_ta_cua_hien_tai.jpg', 'chung_ta_cua_hien_tai.mp3',
   N'Ballad', 'Song', 262,
   N'Ballad xúc động về tình yêu', 1, 1, 'U1');                     -- ID 3

-- Bài cũ AlbumID = NULL
INSERT INTO MediaItem
  (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
  (N'Chăm Hoa',
   'thumb_cham_hoa.jpg', 'cham_hoa.mp3',
   N'Pop', 'Song', 246,
   N'Ca khúc nổi tiếng của Mono', 6, NULL, 'U2'),                   -- ID 4

  (N'Waiting For You',
   'thumb_waiting_for_you.jpg', 'waiting_for_you.mp3',
   N'Ballad', 'Song', 230,
   N'Ca khúc nổi tiếng của Mono', 6, NULL, 'U2'),                   -- ID 5

  (N'Thu Đợi',
   'thumb_thu_doi.jpg', 'thu_doi.mp3',
   N'Pop Ballad', 'Song', 198,
   N'Bản ballad nhẹ nhàng về nỗi nhớ và sự chia ly', 10, NULL, 'U2'), -- ID 6

  (N'Tim Anh Ghen',
   'thumb_tim_anh_ghen.jpg', 'tim_anh_ghen.mp3',
   N'Hip-Hop', 'Song', 237,
   N'Bài hát mang năng lượng giới trẻ hiện đại', 12, NULL, 'U1'),   -- ID 7

  (N'Chấm Hết',
   'thumb_cham_het.jpg', 'cham_het.mp3',
   N'Hip-Hop', 'Song', 200,
   N'Cảm xúc sau khi một mối quan hệ tan vỡ', 3, NULL, 'U1'),       -- ID 8

  (N'Đánh Đổi',
   'thumb_danh_doi.jpg', 'danh_doi.mp3',
   N'Hip-Hop', 'Song', 230,
   N'Hành trình trưởng thành của Obito trong âm nhạc', 9, NULL, 'U2'), -- ID 9

  (N'Ngựa Ô',
   'thumb_ngua_o.jpg', 'ngua_o.mp3',
   N'Hip-Hop', 'Song', 230,
   N'Tinh thần người trẻ âm thầm vươn lên từ con số không', 3, NULL, 'U2'), -- ID 10

  (N'HOP ON DA SHOW',
   'thumb_hop_on_da_show.jpg', 'hop_on_da_show.mp3',
   N'Hip-Hop', 'Song', 180,
   N'Bản nhạc năng lượng cao về không khí biểu diễn', 2, NULL, 'U2'), -- ID 11

  (N'See Tình',
   'thumb_mv_see_tinh.jpg', 'mv_see_tinh.mp4',
   N'Pop', 'Video', 285,
   N'MV đình đám của Hoàng Thùy Linh – triệu view', 7, NULL, 'U1'),  -- ID 12

  (N'Để Mị Nói Cho Mà Nghe',
   'thumb_mv_de_mi_noi.jpg', 'mv_de_mi_noi.mp4',
   N'Pop / Folk Fusion', 'Video', 242,
   N'MV dân gian đương đại viral của Hoàng Thùy Linh', 7, NULL, 'U2'), -- ID 13

  (N'Chạy Ngay Đi',
   'thumb_mv_chay_ngay_di.jpg', 'mv_chay_ngay_di.mp4',
   N'Pop', 'Video', 250,
   N'MV huyền thoại của Sơn Tùng M-TP', 1, NULL, 'U3'),             -- ID 14

  (N'Hãy Trao Cho Anh',
   'thumb_mv_hay_trao_cho_anh.jpg', 'mv_hay_trao_cho_anh.mp4',
   N'Pop', 'Video', 273,
   N'MV triệu view Sơn Tùng M-TP ft. Snoop Dogg', 1, NULL, 'U1'),   -- ID 15

  (N'Dự Báo Thời Tiết Hôm Nay Mưa',
   'thumb_du_bao_thoi_tiet_hom_nay_mua.jpg', 'du_bao_thoi_tiet_hom_nay_mua.mp4',
   N'R&B', 'Video', 290,
   N'Ca khúc sâu lắng của GREY D – tâm trạng sau chia tay khi trời mưa', 8, NULL, 'U2'); -- ID 16

-- Bài mới – ÁNH SÁNG • MÀN ĐÊM (AlbumID 2) – 8 bài GREY D
INSERT INTO MediaItem
  (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
  (N'hóa ra...',
   'thumb_hoa_ra.jpg', 'hoa_ra.mp3',
   N'R&B / Pop', 'Song', 204,
   N'Track mở màn album ÁNH SÁNG • MÀN ĐÊM', 8, 2, 'U1'),          -- ID 17

  (N'yêu em như…',
   'thumb_yeu_em_nhu.jpg', 'yeu_em_nhu.mp3',
   N'R&B', 'Song', 160,
   N'Bản R&B ngọt ngào trong album ÁNH SÁNG • MÀN ĐÊM', 8, 2, 'U1'), -- ID 18

  (N'mộng tình',
   'thumb_mong_tinh.jpg', 'mong_tinh.mp3',
   N'Pop / R&B', 'Song', 199,
   N'Ca khúc mộng mơ giai điệu nhẹ nhàng của GREY D', 8, 2, 'U2'), -- ID 19

  (N'đôi mắt kẻ tình si',
   'thumb_doi_mat_ke_tinh_si.jpg', 'doi_mat_ke_tinh_si.mp3',
   N'R&B', 'Song', 198,
   N'Bài hát về ánh mắt đắm say của người đang yêu', 8, 2, 'U2'),   -- ID 20

  (N'mới hôm qua',
   'thumb_moi_hom_qua.jpg', 'moi_hom_qua.mp3',
   N'Pop Ballad', 'Song', 211,
   N'Ca khúc đong đầy cảm xúc hoài niệm của GREY D', 8, 2, 'U3'),  -- ID 21

  (N'tựa đầu',
   'thumb_tua_dau.jpg', 'tua_dau.mp3',
   N'Ballad', 'Song', 212,
   N'Bản ballad nhẹ nhàng về sự nương tựa trong tình yêu', 8, 2, 'U3'), -- ID 22

  (N'hơi thở của gió',
   'thumb_hoi_tho_cua_gio.jpg', 'hoi_tho_cua_gio.mp3',
   N'Indie Pop', 'Song', 157,
   N'Track kết thúc side A với giai điệu nhẹ như hơi thở', 8, 2, 'U1'), -- ID 23

  (N'dự báo thời tiết hôm nay mưa',
   'thumb_du_bao_thoi_tiet.jpg', 'du_bao_thoi_tiet.mp3',
   N'R&B', 'Song', 292,
   N'Hit triệu stream – tâm trạng sau chia tay khi trời mưa', 8, 2, 'U2'); -- ID 24

-- Bài mới – GIỮA MỘT VẠN NGƯỜI (AlbumID 3) – 12 bài Phùng Khánh Linh
INSERT INTO MediaItem
  (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
  (N'Grief Is The Price You Pay For Love',
   'thumb_grief.jpg', 'grief.mp3',
   N'Alternative Pop', 'Song', 210,
   N'Track mở màn – dẫn dắt người nghe vào hành trình cảm xúc đầy day dứt', 13, 3, 'U1'), -- ID 25

  (N'Hiện Thực Phũ Phàng',
   'thumb_hien_thuc_phu_phang.jpg', 'hien_thuc_phu_phang.mp3',
   N'Dream Pop', 'Song', 210,
   N'Ca khúc đối mặt với sự thật đau lòng trong tình yêu', 13, 3, 'U1'), -- ID 26

  (N'Cờ Người',
   'thumb_co_nguoi.jpg', 'co_nguoi.mp3',
   N'Indie Rock', 'Song', 234,
   N'Cảm giác bị sử dụng như một quân cờ trong mối quan hệ', 13, 3, 'U2'), -- ID 27

  (N'Anh Là Thằng Tồi',
   'thumb_anh_la_thang_toi.jpg', 'anh_la_thang_toi.mp3',
   N'Punk Pop', 'Song', 206,
   N'Ca khúc bùng nổ cảm xúc với chất Punk pha Pop', 13, 3, 'U2'), -- ID 28

  (N'Linh Cảm',
   'thumb_linh_cam.jpg', 'linh_cam.mp3',
   N'Dream Pop', 'Song', 256,
   N'Trực giác khi biết mối tình sắp tan vỡ', 13, 3, 'U3'),        -- ID 29

  (N'Ám Ảnh Về Anh',
   'thumb_am_anh_ve_anh.jpg', 'am_anh_ve_anh.mp3',
   N'Alternative Pop', 'Song', 186,
   N'Nỗi ám ảnh khó thoát khỏi sau khi chia tay', 13, 3, 'U3'),   -- ID 30

  (N'Ước Anh Tan Nát Con Tim',
   'thumb_uoc_anh_tan_nat_con_tim.jpg', 'uoc_anh_tan_nat_con_tim.mp3',
   N'Indie Pop', 'Song', 234,
   N'Đĩa đơn mở đường – thể hiện sự tức giận và tổn thương', 13, 3, 'U1'), -- ID 31

  (N'Điều Em Không Muốn',
   'thumb_dieu_em_khong_muon.jpg', 'dieu_em_khong_muon.mp3',
   N'Dream Pop', 'Song', 231,
   N'Những điều không dám nói ra trong tình yêu', 13, 3, 'U2'),    -- ID 32

  (N'Hãy Nói Anh Sai Rồi',
   'thumb_hay_noi_anh_sai_roi.jpg', 'hay_noi_anh_sai_roi.mp3',
   N'Alternative Pop', 'Song', 194,
   N'Cầu xin được phủ nhận để có lý do tiếp tục ở lại', 13, 3, 'U3'), -- ID 33

  (N'Khóc Blóck',
   'thumb_khoc_block.jpg', 'khoc_block.mp3',
   N'Indie Pop', 'Song', 183,
   N'Đĩa đơn viral – khóc rồi block, kết thúc dứt khoát', 13, 3, 'U1'), -- ID 34

  (N'Tâm Sự Với Đêm Một Mình',
   'thumb_tam_su_voi_dem.jpg', 'tam_su_voi_dem.mp3',
   N'Dream Pop', 'Song', 183,
   N'Solo trong đêm khuya, trò chuyện với chính bản thân', 13, 3, 'U2'), -- ID 35

  (N'Em Đau',
   'thumb_em_dau.jpg', 'em_dau.mp3',
   N'Alternative Pop', 'Song', 307,
   N'Track kết thúc album ft. Thành Luke – cảm xúc giải thoát', 13, 3, 'U3'); -- ID 36

-- ─────────────────────────────────────────────
-- PLAYLISTS
-- ─────────────────────────────────────────────
INSERT INTO Playlist (PlaylistName, Description, UserID)
VALUES

  (N'Nhạc Chill Tối',       N'Nghe buổi tối thư giãn',          'U1'),  -- ID 1
  (N'Rap Đỉnh',             N'Những bản rap Việt hay nhất',      'U2'),  -- ID 2
  (N'MV Không Thể Bỏ Qua', N'Tổng hợp MV viral Việt Nam',      'U3'),  -- ID 3
  (N'Ballad Ôm Tim',        N'Ballad buồn nghe mà thấm',         'U1'); -- ID 4
 

  (N'Nhạc Chill Tối',        N'Nghe buổi tối thư giãn',          'U1'),  -- ID 1
  (N'Rap Đỉnh',              N'Những bản rap Việt hay nhất',      'U2'),  -- ID 2
  (N'MV Không Thể Bỏ Qua',  N'Tổng hợp MV viral Việt Nam',      'U3'),  -- ID 3
  (N'Ballad Ôm Tim',         N'Ballad buồn nghe mà thấm',         'U1'),  -- ID 4
  (N'GREY D Vibes',          N'Nhạc GREY D nghe là thấm',         'U3'),  -- ID 5
  (N'Phùng Khánh Linh Fan',  N'Full album Giữa Một Vạn Người',   'U2');  -- ID 6

-- ─────────────────────────────────────────────
-- PLAYLIST TRACKS
-- ─────────────────────────────────────────────
INSERT INTO PlaylistTrack (PlaylistID, MediaItemID)
VALUES

  -- Playlist 1: Nhạc Chill Tối (ballad, pop nhẹ)
  (1, 3),   -- Chúng Ta Của Hiện Tại
  (1, 4),   -- Chăm Hoa
  (1, 5),   -- Waiting For You
  (1, 6),   -- hóa ra ...
  (1, 7),   -- Thu Đợi
 
  -- Playlist 2: Rap Đỉnh
  (2, 8),   -- Tim Anh Ghen
  (2, 9),   -- Chấm Hết
  (2, 10),  -- Đánh Đổi
  (2, 11),  -- Ngựa Ô
  (2, 12),  -- HOP ON DA SHOW
 
  -- Playlist 3: MV Không Thể Bỏ Qua
  (3, 13),  -- See Tình
  (3, 14),  -- Để Mị Nói Cho Mà Nghe
  (3, 15),  -- Chạy Ngay Đi
  (3, 16),  -- Hãy Trao Cho Anh
  (3, 17),  -- Dự Báo Thời Tiết Hôm Nay Mưa
 
  -- Playlist 4: Ballad Ôm Tim
  (4, 3),   -- Chúng Ta Của Hiện Tại
  (4, 5),   -- Waiting For You
  (4, 7),   -- Thu Đợi
  (4, 9);   -- Chấm Hết
 

  -- Playlist 1: Nhạc Chill Tối
  (1, 3), (1, 4), (1, 5), (1, 6), (1, 22), (1, 35),

  -- Playlist 2: Rap Đỉnh
  (2, 7), (2, 8), (2, 9), (2, 10), (2, 11),

  -- Playlist 3: MV Không Thể Bỏ Qua
  (3, 12), (3, 13), (3, 14), (3, 15), (3, 16),

  -- Playlist 4: Ballad Ôm Tim
  (4, 3), (4, 5), (4, 22), (4, 29), (4, 35), (4, 36),

  -- Playlist 5: GREY D Vibes
  (5, 17), (5, 18), (5, 19), (5, 20), (5, 21), (5, 22), (5, 23), (5, 24),

  -- Playlist 6: Phùng Khánh Linh Fan
  (6, 25),(6, 26),(6, 27),(6, 28),(6, 29),(6, 30),
  (6, 31),(6, 32),(6, 33),(6, 34),(6, 35),(6, 36);

-- ─────────────────────────────────────────────
-- FAVORITES
-- ─────────────────────────────────────────────
INSERT INTO Favorite (UserID, MediaItemID)
VALUES

  -- khanhdang thích nhạc pop + MV Sơn Tùng
  ('U1', 1),   -- Come My Way
  ('U1', 2),   -- Có Chắc Yêu Là Đây
  ('U1', 15),  -- Chạy Ngay Đi (MV)
  ('U1', 16),  -- Hãy Trao Cho Anh (MV)
 
  -- vietduc thích rap
  ('U2', 8),   -- Tim Anh Ghen
  ('U2', 9),   -- Chấm Hết
  ('U2', 11),  -- Ngựa Ô
  ('U2', 12),  -- HOP ON DA SHOW
 
  -- thanhnhan thích chill + MV
  ('U3', 5),   -- Waiting For You
  ('U3', 6),   -- hóa ra ...
  ('U3', 13),  -- See Tình (MV)
  ('U3', 14);  -- Để Mị Nói Cho Mà Nghe (MV)
 

  ('U1', 1), ('U1', 2), ('U1', 14), ('U1', 15), ('U1', 17), ('U1', 31),
  ('U2', 7), ('U2', 8), ('U2', 10), ('U2', 11), ('U2', 24), ('U2', 35),
  ('U3', 5), ('U3', 6), ('U3', 12), ('U3', 13), ('U3', 29), ('U3', 36);

-- ─────────────────────────────────────────────
-- FOLLOWS (user → artist)
-- ─────────────────────────────────────────────
INSERT INTO Follow (FollowerID, FollowingUserID, FollowingArtistID)
VALUES

  ('U1', NULL, 1),   -- khanhdang → Sơn Tùng M-TP
  ('U1', NULL, 6),   -- khanhdang → Mono
  ('U1', NULL, 7),   -- khanhdang → Hoàng Thùy Linh
 
  ('U2', NULL, 2),   -- vietduc  → Low G
  ('U2', NULL, 3),   -- vietduc  → Dangrangto
  ('U2', NULL, 12),  -- vietduc  → Wxrdie
 
  ('U3', NULL, 8),   -- thanhnhan → GREY D
  ('U3', NULL, 9),   -- thanhnhan → Obito
  ('U3', NULL, 10);  -- thanhnhan → Wren Evans
 

  ('U1', NULL, 1), ('U1', NULL, 6), ('U1', NULL, 8),  ('U1', NULL, 13),
  ('U2', NULL, 2), ('U2', NULL, 3), ('U2', NULL, 12), ('U2', NULL, 13),
  ('U3', NULL, 7), ('U3', NULL, 8), ('U3', NULL, 9),  ('U3', NULL, 10);

-- ─────────────────────────────────────────────
-- FOLLOWS (user → user)
-- ─────────────────────────────────────────────
INSERT INTO Follow (FollowerID, FollowingUserID, FollowingArtistID)
VALUES

  ('U1', 'U2', NULL),  -- khanhdang follow vietduc
  ('U2', 'U3', NULL),  -- vietduc  follow thanhnhan
  ('U3', 'U1', NULL);  -- thanhnhan follow khanhdang

  ('U1', 'U2', NULL),
  ('U2', 'U3', NULL),
  ('U3', 'U1', NULL);
 
