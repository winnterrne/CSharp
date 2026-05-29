INSERT INTO AspNetUsers(UserID, UserName, Email, Password, Role, Phone)
VALUES 
('U1', 'user1', 'user1@gmail.com', '123', 'User', '0123456789'),
('U2', 'user2', 'user2@gmail.com', '123', 'User', '0987654321');

INSERT INTO Artist(ArtistName)
VALUES
(N'Sơn Tùng M-TP'),
(N'Đen Vâu'),
(N'Mỹ Tâm'),
(N'Jack'),
(N'Binz'),
(N'Noo Phước Thịnh'),
(N'Chi Pu'),
(N'Erik'),
(N'AMEE'),
(N'Karik');

INSERT INTO Album(AlbumName, Title, RealeaseDate, ArtistID, UserID)
VALUES
(N'Album 1', N'Hit Song Collection', '2023-01-01', 1, 'U1'),
(N'Album 2', N'Best Video Collection', '2023-06-01', 2, 'U2');

INSERT INTO MediaItem
(TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
(N'Hãy Trao Cho Anh', 'img1.jpg', 'song1.mp3', N'Pop', 'Song', 240, N'Hit của Sơn Tùng', 1, 1, 'U1'),
(N'Bài Này Chill Phết', 'img2.jpg', 'song2.mp3', N'Rap', 'Song', 300, N'Nhạc chill', 2, 1, 'U1'),
(N'Người Hãy Quên Em Đi', 'img3.jpg', 'song3.mp3', N'Ballad', 'Song', 280, N'Nhạc buồn', 3, 1, 'U2'),
(N'Sóng Gió', 'img4.jpg', 'song4.mp3', N'Pop', 'Song', 260, N'Hit Jack', 4, 1, 'U2'),
(N'Bigcityboi', 'img5.jpg', 'song5.mp3', N'Rap', 'Song', 220, N'Nhạc Binz', 5, 1, 'U1');

INSERT INTO MediaItem
(TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
(N'Chạm Khẽ Tim Anh Một Chút Thôi', 'vid1.jpg', 'video1.mp4', N'MV', 'Video', 300, N'MV Noo', 6, 2, 'U1'),
(N'Anh Ơi Ở Lại', 'vid2.jpg', 'video2.mp4', N'MV', 'Video', 320, N'MV Chi Pu', 7, 2, 'U2'),
(N'Có Tất Cả Nhưng Thiếu Anh', 'vid3.jpg', 'video3.mp4', N'MV', 'Video', 310, N'MV Erik', 8, 2, 'U1'),
(N'Anh Nhà Ở Đâu Thế', 'vid4.jpg', 'video4.mp4', N'MV', 'Video', 330, N'MV AMEE', 9, 2, 'U2'),
(N'Người Lạ Ơi', 'vid5.jpg', 'video5.mp4', N'MV', 'Video', 340, N'MV Karik', 10, 2, 'U1');