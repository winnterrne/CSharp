
-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
-- CÁI NÀY TẠO THỦ CÔNG THÔNG QUA REGISTER
-- INSERT INTO AspNetUsers (UserID, UserName, UserImage, Email, Password, Role, Phone)
-- VALUES
--   ('U1', 'khanhdang',  'avatar_khanhdang.jpg',  'khanhdang@gmail.com',  '123', 'User', '0901234567'),
--   ('U2', 'vietduc',   'avatar_vietduc.jpg',   'vietduc@gmail.com',   '123', 'User', '0912345678'),
--   ('U3', 'thanhnhan',  'avatar_thanhnhan.jpg',  'thanhnhan@gmail.com',  '123', 'User', '0923456789'),
--   ('U4', 'ngocvinh',  'avatar_ngocvinh.jpg',  'ngocvinh@gmail.com',  '123', 'User', '0923456789');

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
  (N'Wxrdie',           'artist_wrxdie.jpg');        -- ID 12

-- ─────────────────────────────────────────────
-- ALBUMS
-- ─────────────────────────────────────────────
INSERT INTO Album (AlbumName, Title, AlbumItemImage, ReleaseDate, ArtistID, UserID)
VALUES
  (N'Nhạc Việt Đỉnh Cao', N'Top Hits Việt Nam', 'album_top_hits.jpg',     '2024-01-01', 1, 'U1'),
  (N'Rap Việt Nổi Bật',   N'Best of Rap Việt',  'album_rap_viet.jpg',      '2024-01-01', 2, 'U2'),
  (N'MV Viral',           N'Music Videos Triệu View',      'album_mv_viral.jpg',      '2024-01-01', 7, 'U3');

-- ─────────────────────────────────────────────
-- MEDIA ITEMS - Songs (AlbumID 1: Top Hits)
-- MediaItemTag: thể loại nhạc thực tế (Pop, Ballad, R&B, ...)
-- ─────────────────────────────────────────────
INSERT INTO MediaItem
  (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
    (N'Come My Way',
   'thumb_come_my_way.jpg',
   'audio/come_my_way.mp3',
   N'Pop', 'Song', 220,
   N'Bản hit đỉnh cao của Sơn Tùng M-TP', 1, 1, 'U1'),

  (N'Có Chắc Yêu Là Đây',
   'thumb_song_co_chac_yeu_la_day.jpg',
   'audio/song_co_chac_yeu_la_day.mp3',
   N'Pop', 'Song', 193,
   N'Bản hit đỉnh cao của Sơn Tùng M-TP', 1, 1, 'U1'),

  (N'Chúng Ta Của Hiện Tại',
   'thumb_song_chung_ta_cua_hien_tai.jpg',
   'audio/song_chung_ta_cua_hien_tai.mp3',
   N'Ballad', 'Song', 262,
   N'Ballad xúc động về tình yêu', 1, 1, 'U1'),

  (N'Chăm Hoa',
   'thumb_cham_hoa.jpg',
   'audio/cham_hoa.mp3',
   N'Pop', 'Song', 246,
   N'Ca khúc nổi tiếng của Mono', 6, 1, 'U2'),

  (N'Waiting For You',
   'thumb_song_waiting_for_you.jpg',
   'audio/song_waiting_for_you.mp3',
   N'Ballad', 'Song', 230,
   N'Ca khúc nổi tiếng của Mono', 6, 1, 'U2'),

  (N'hóa ra ...',
   'thumb_hoa_ra.jpg',
   'audio/hoa_ra.mp3',
   N'Pop', 'Song', 212,
   N'Hit của GREY D ft. tlinh', 8, 1, 'U3'),

  (N'Thu Đợi',
   'thumb_thu_doi.jpg',
   'audio/thu_doi.mp3',
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
   'audio/tim_anh_ghen.mp3',
   N'Hip-Hop', 'Song', 237,
   N'Bài hát Bài hát mang năng lượng của giới trẻ hiện đại, kết hợp giữa chất gang, sự tự tin, hành trình đi lên từ khó khăn và phong cách sống của các rapper trẻ',
   12, 2, 'U1'),

   (N'Chấm Hết',
   'thumb_cham_het.jpg',
   'audio/cham_het.mp3',
   N'Hip-Hop', 'Song', 200,
   N'Chấm Hết kể về cảm xúc sau khi một mối quan hệ tan vỡ. Nhân vật trong bài hát trải qua sự thất vọng, tổn thương và tức giận khi người mình yêu rời đi, nhưng đồng thời cũng cố tỏ ra mạnh mẽ và chấp nhận sự kết thúc của chuyện tình',
   3,2, 'U1'),

   (N'Đánh Đổi',
   'thumb_danh_doi.jpg',
   'audio/danh_doi.mp3',
   N'Hip-Hop', 'Song', 230,
   N'Đánh Đổi kể về hành trình trưởng thành của Obito trong âm nhạc và cuộc sống. Bài hát xoay quanh những gì người nghệ sĩ phải hy sinh để theo đuổi đam mê: thời gian, tuổi trẻ, sự bình yên và cả những tổn thương tinh thần',
    9, 2, 'U2'),

    (N'Ngựa Ô',
   'thumb_ngua_o.jpg',
   'audio/ngua_o.mp3',
   N'Hip-Hop', 'Song', 230,
   N'mang tinh thần của những người trẻ đang theo đuổi thành công từ con số không. Hình ảnh ngựa ô tượng trưng cho những người không được đánh giá cao ban đầu nhưng vẫn âm thầm vươn lên và tạo bất ngờ',
    3, 2, 'U2'),

    (N'HOP ON DA SHOW',
   'thumb_hop_on_da_show.jpg',
   'audio/hop_on_da_show.mp3',
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
   'video/mv_see_tinh.mp4',
   N'Pop', 'Video', 285,
   N'MV đình đám của Hoàng Thùy Linh – triệu view', 7, 3, 'U1'),

  (N'Để Mị Nói Cho Mà Nghe',
   'thumb_mv_de_mi_noi.jpg',
   'video/mv_de_mi_noi.mp4',
   N'Pop / Folk Fusion', 'Video', 242,
   N'MV dân gian đương đại viral của Hoàng Thùy Linh', 7, 3, 'U2'),

  (N'Chạy Ngay Đi',
   'thumb_mv_chay_ngay_di.jpg',
   'video/mv_chay_ngay_di.mp4',
   N'Pop', 'Video', 250,
   N'MV huyền thoại của Sơn Tùng M-TP', 1, 3, 'U3'),

  (N'Hãy Trao Cho Anh',
   'thumb_mv_hay_trao_cho_anh.jpg',
   'video/mv_hay_trao_cho_anh.mp4',
   N'Pop', 'Video', 273,
   N'MV triệu view Sơn Tùng M-TP ft. Snoop Dogg. ca khúc tình yêu mang không khí mùa hè sôi động, kể về sự say mê trước một cô gái quyến rũ và mong muốn được đáp lại tình cảm', 
   1, 3, 'U1'),

  (N'Dự Báo Thời Tiết Hôm Nay Mưa',
   'thumb_du_bao_thoi_tiet_hom_nay_mua.jpg',
   'video/du_bao_thoi_tiet_hom_nay_mua.mp4',
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
 
-- ─────────────────────────────────────────────
-- PLAYLISTS
-- ─────────────────────────────────────────────
INSERT INTO Playlist (PlaylistName, Description, UserID)
VALUES
  (N'Nhạc Chill Tối',       N'Nghe buổi tối thư giãn',          'U1'),  -- ID 1
  (N'Rap Đỉnh',             N'Những bản rap Việt hay nhất',      'U2'),  -- ID 2
  (N'MV Không Thể Bỏ Qua', N'Tổng hợp MV viral Việt Nam',      'U3'),  -- ID 3
  (N'Ballad Ôm Tim',        N'Ballad buồn nghe mà thấm',         'U1'); -- ID 4
 
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
 
-- ─────────────────────────────────────────────
-- FAVORITES
-- ─────────────────────────────────────────────
INSERT INTO Favorite (UserID, MediaItemID)
VALUES
  -- ngoclinh thích nhạc pop + MV Sơn Tùng
  ('U1', 1),   -- Come My Way
  ('U1', 2),   -- Có Chắc Yêu Là Đây
  ('U1', 15),  -- Chạy Ngay Đi (MV)
  ('U1', 16),  -- Hãy Trao Cho Anh (MV)
 
  -- minhduc thích rap
  ('U2', 8),   -- Tim Anh Ghen
  ('U2', 9),   -- Chấm Hết
  ('U2', 11),  -- Ngựa Ô
  ('U2', 12),  -- HOP ON DA SHOW
 
  -- thuyhang thích chill + MV
  ('U3', 5),   -- Waiting For You
  ('U3', 6),   -- hóa ra ...
  ('U3', 13),  -- See Tình (MV)
  ('U3', 14);  -- Để Mị Nói Cho Mà Nghe (MV)
 
-- ─────────────────────────────────────────────
-- FOLLOWS (user → artist)
-- ─────────────────────────────────────────────
INSERT INTO Follow (FollowerID, FollowingUserID, FollowingArtistID)
VALUES
  ('U1', NULL, 1),   -- ngoclinh → Sơn Tùng M-TP
  ('U1', NULL, 6),   -- ngoclinh → Mono
  ('U1', NULL, 7),   -- ngoclinh → Hoàng Thùy Linh
 
  ('U2', NULL, 2),   -- minhduc  → Low G
  ('U2', NULL, 3),   -- minhduc  → Dangrangto
  ('U2', NULL, 12),  -- minhduc  → Wxrdie
 
  ('U3', NULL, 8),   -- thuyhang → GREY D
  ('U3', NULL, 9),   -- thuyhang → Obito
  ('U3', NULL, 10);  -- thuyhang → Wren Evans
 
-- ─────────────────────────────────────────────
-- FOLLOWS (user → user)
-- ─────────────────────────────────────────────
INSERT INTO Follow (FollowerID, FollowingUserID, FollowingArtistID)
VALUES
  ('U1', 'U2', NULL),  -- ngoclinh follow minhduc
  ('U2', 'U3', NULL),  -- minhduc  follow thuyhang
  ('U3', 'U1', NULL);  -- thuyhang follow ngoclinh
 