INSERT INTO AspNetUsers(UserID, UserName, UserImage, Email, Password, Role, Phone)
VALUES 
('U1', 'nhan1', 'user1.jpg', 'user1@gmail.com', '123', 'User', '0123456789'),
('U2', 'nhan2', 'user2.jpg', 'user2@gmail.com', '123', 'User', '0987654321');

INSERT INTO Artist(ArtistName, ArtistImage)
VALUES
(N'Sơn Tùng M-TP', 'st.jpg'),
(N'Đen Vâu', 'den.jpg'),
(N'Mỹ Tâm', 'mytam.jpg'),
(N'Jack', 'jack.jpg'),
(N'Binz', 'binz.jpg'),
(N'Noo Phước Thịnh', 'noo.jpg'),
(N'Chi Pu', 'chipu.jpg'),
(N'Erik', 'erik.jpg'),
(N'AMEE', 'amee.jpg'),
(N'Karik', 'karik.jpg');

INSERT INTO Album(AlbumName, Title, AlbumItemImage, RealeaseDate, ArtistID, UserID)
VALUES
(N'Album Hit', N'Best Songs 2023', 'album1.jpg', '2023-01-01', 1, 'U1'),
(N'Album MV', N'Best Videos 2023', 'album2.jpg', '2023-06-01', 2, 'U2');

INSERT INTO MediaItem
(TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
(N'Hãy Trao Cho Anh', 'song1.jpg', 'song1.mp3', N'Pop', 'Song', 240, N'Hit Sơn Tùng', 1, 1, 'U1'),
(N'Bài Này Chill Phết', 'song2.jpg', 'song2.mp3', N'Rap', 'Song', 300, N'Nhạc chill', 2, 1, 'U1'),
(N'Người Hãy Quên Em Đi', 'song3.jpg', 'song3.mp3', N'Ballad', 'Song', 280, N'Nhạc buồn', 3, 1, 'U2'),
(N'Sóng Gió', 'song4.jpg', 'song4.mp3', N'Pop', 'Song', 260, N'Hit Jack', 4, 1, 'U2'),
(N'Bigcityboi', 'song5.jpg', 'song5.mp3', N'Rap', 'Song', 220, N'Nhạc Binz', 5, 1, 'U1');

INSERT INTO MediaItem
(TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, Description, ArtistID, AlbumID, UserID)
VALUES
(N'Chạm Khẽ Tim Anh', 'vid1.jpg', 'video1.mp4', N'MV', 'Video', 300, N'MV Noo', 6, 2, 'U1'),
(N'Anh Ơi Ở Lại', 'vid2.jpg', 'video2.mp4', N'MV', 'Video', 320, N'MV Chi Pu', 7, 2, 'U2'),
(N'Có Tất Cả Nhưng Thiếu Anh', 'vid3.jpg', 'video3.mp4', N'MV', 'Video', 310, N'MV Erik', 8, 2, 'U1'),
(N'Anh Nhà Ở Đâu Thế', 'vid4.jpg', 'video4.mp4', N'MV', 'Video', 330, N'MV AMEE', 9, 2, 'U2'),
(N'Người Lạ Ơi', 'vid5.jpg', 'video5.mp4', N'MV', 'Video', 340, N'MV Karik', 10, 2, 'U1');

INSERT INTO Playlist(PlaylistName, Description, UserID)
VALUES
(N'Nhạc Chill', N'Nghe buổi tối', 'U1'),
(N'Nhạc Hot', N'Top trending', 'U2');

INSERT INTO PlaylistTrack(PlaylistID, MediaItemID)
VALUES
(1,1),(1,2),(1,3),
(2,4),(2,5),(2,6);

INSERT INTO Favorite(UserID, MediaItemID)
VALUES
('U1',1),('U1',6),
('U2',2),('U2',7);