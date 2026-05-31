DROP TABLE IF EXISTS Follow;
DROP TABLE IF EXISTS MediaShare;
DROP TABLE IF EXISTS PlayHistory;
DROP TABLE IF EXISTS Favorite;
DROP TABLE IF EXISTS PlaylistTrack;
DROP TABLE IF EXISTS MediaItem;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Playlist;
DROP TABLE IF EXISTS Album;
DROP TABLE IF EXISTS Artist;
DROP TABLE IF EXISTS AspNetUsers;

/* 1. Bảng AspNetUsers */
CREATE TABLE AspNetUsers(
    UserID NVARCHAR(450) PRIMARY KEY, 
    UserName NVARCHAR(255),
    UserImage NVARCHAR(MAX) DEFAULT NULL,
    Email NVARCHAR(255),
    Password NVARCHAR(MAX),
    Role NVARCHAR(50), 
    Phone NVARCHAR(20),
    IsDeleted BIT NOT NULL CONSTRAINT DF_AspNetUsers_IsDeleted DEFAULT(0)
);

/* 2. Bảng Artist */
CREATE TABLE Artist(
    ArtistID INT IDENTITY(1,1) PRIMARY KEY,
    ArtistName NVARCHAR(255),
    ArtistImage NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsDeleted BIT NOT NULL CONSTRAINT DF_Album_IsDeleted DEFAULT(0)
);

/* 3. Bảng Album */
CREATE TABLE Album(
    AlbumID INT IDENTITY(1,1) PRIMARY KEY,
    AlbumName NVARCHAR(255),
    Title NVARCHAR(255),
    AlbumItemImage NVARCHAR(MAX),
    ReleaseDate DATETIME,
    UploadAT DATETIME DEFAULT GETDATE(),
    ArtistID INT FOREIGN KEY REFERENCES Artist(ArtistID),
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    IsDeleted BIT NOT NULL CONSTRAINT DF_Playlist_IsDeleted DEFAULT(0) 
);

/* 4. Bảng Playlist */
CREATE TABLE Playlist(
    PlaylistID INT IDENTITY(1,1) PRIMARY KEY,
    PlaylistName NVARCHAR(255),
    IsPublic BIT DEFAULT 1,
    Description NVARCHAR(MAX),
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    IsDeleted BIT NOT NULL CONSTRAINT DF_Notification_IsDeleted DEFAULT(0)
);

/* 5. Bảng Notification (Phụ thuộc AspNetUsers) */
CREATE TABLE Notification(
    NotificationID INT IDENTITY(1,1) PRIMARY KEY, 
    Title NVARCHAR(255),
    Type NVARCHAR(50),
    Payload NVARCHAR(MAX), 
    IsRead BIT DEFAULT 0,
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    IsDeleted BIT NOT NULL CONSTRAINT DF_Artist_IsDeleted DEFAULT(0)
);

/* 6. Bảng MediaItem */
CREATE TABLE MediaItem(
    MediaItemID INT IDENTITY(1,1) PRIMARY KEY,
    TitleName NVARCHAR(255),
    MediaItemImage NVARCHAR(MAX), 
    filePath NVARCHAR(MAX), 
    MediaItemTag NVARCHAR(255),
    MediaItemType NVARCHAR(50), 
    Duration INT, 
    UploadAT DATETIME DEFAULT GETDATE(),
    Description NVARCHAR(MAX),
    ArtistID INT FOREIGN KEY REFERENCES Artist(ArtistID),
    AlbumID INT NULL FOREIGN KEY REFERENCES Album(AlbumID), 
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    IsDeleted BIT NOT NULL CONSTRAINT DF_MediaItem_IsDeleted DEFAULT(0)
);

/* 7. Bảng PlaylistTrack */
CREATE TABLE PlaylistTrack(
    PlaylistID INT FOREIGN KEY REFERENCES Playlist(PlaylistID),
    MediaItemID INT FOREIGN KEY REFERENCES MediaItem(MediaItemID),
    PRIMARY KEY (PlaylistID, MediaItemID)
);

/* 8. Bảng Favorite */
CREATE TABLE Favorite(
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    MediaItemID INT FOREIGN KEY REFERENCES MediaItem(MediaItemID),
    PRIMARY KEY (UserID, MediaItemID)
);

/* 9. Bảng PlayHistory */
CREATE TABLE PlayHistory(
    HistoryID INT IDENTITY(1,1) PRIMARY KEY,
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    MediaItemID INT FOREIGN KEY REFERENCES MediaItem(MediaItemID),
    PlayedAt DATETIME DEFAULT GETDATE()
);

/* 10. Bảng MediaShare */
CREATE TABLE MediaShare(
    ShareID INT IDENTITY(1,1) PRIMARY KEY,
    SenderID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID), 
    ReceiverID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID), 
    MediaItemID INT NULL FOREIGN KEY REFERENCES MediaItem(MediaItemID), 
    PlaylistID INT NULL FOREIGN KEY REFERENCES Playlist(PlaylistID), 
    SharedAt DATETIME DEFAULT GETDATE()
);

/* 11. Bảng Follow */
CREATE TABLE Follow(
    FollowID INT IDENTITY(1,1) PRIMARY KEY,
    FollowerID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    FollowingUserID NVARCHAR(450) NULL FOREIGN KEY REFERENCES AspNetUsers(UserID),
    FollowingArtistID INT NULL FOREIGN KEY REFERENCES Artist(ArtistID)
);