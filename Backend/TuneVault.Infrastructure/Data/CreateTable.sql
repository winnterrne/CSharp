/* 1. Bảng AspNetUsers */
CREATE TABLE AspNetUsers(
    UserID NVARCHAR(450) PRIMARY KEY, 
    UserName NVARCHAR(255),
    Email NVARCHAR(255),
    Password NVARCHAR(MAX),
    Role NVARCHAR(50), 
    Phone NVARCHAR(20)
);

/* 2. Bảng Artist */
CREATE TABLE Artist(
    ArtistID INT IDENTITY(1,1) PRIMARY KEY,
    ArtistName NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsDelete BIT DEFAULT 0
);

/* 3. Bảng Album ) */
CREATE TABLE Album(
    AlbumID INT IDENTITY(1,1) PRIMARY KEY,
    AlbumName NVARCHAR(255),
    Title NVARCHAR(255),
    RealeaseDate DATETIME,
    UploadAT DATETIME DEFAULT GETDATE(),
    ArtistID INT FOREIGN KEY REFERENCES Artist(ArtistID),
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID)
);

/* 4. Bảng Playlist  */
CREATE TABLE Playlist(
    PlaylistID INT IDENTITY(1,1) PRIMARY KEY,
    PlaylistName NVARCHAR(255),
    IsPublic BIT DEFAULT 1,
    Description NVARCHAR(MAX),
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID) 
);

/* 5. Bảng Notification (Phụ thuộc AspNetUsers) */
CREATE TABLE Notification(
    NotificationID INT IDENTITY(1,1) PRIMARY KEY, 
    Title NVARCHAR(255),
    Type NVARCHAR(50),
    Payload NVARCHAR(MAX), 
    IsRead BIT DEFAULT 0,
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID)
);


/* 6. Bảng MediaItem  */
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
    IsDelete BIT DEFAULT 0
);



/* 7. Bảng PlaylistTrack  */
CREATE TABLE PlaylistTrack(
    PlaylistID INT FOREIGN KEY REFERENCES Playlist(PlaylistID),
    MediaItemID INT FOREIGN KEY REFERENCES MediaItem(MediaItemID),
    PRIMARY KEY (PlaylistID, MediaItemID)
);

/* 8. Bảng Favorite  */
CREATE TABLE Favorite(
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    MediaItemID INT FOREIGN KEY REFERENCES MediaItem(MediaItemID),
    PRIMARY KEY (UserID, MediaItemID)
);

/* 9. Bảng PlayHistory  */
CREATE TABLE PlayHistory(
    HistoryID INT IDENTITY(1,1) PRIMARY KEY,
    UserID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    MediaItemID INT FOREIGN KEY REFERENCES MediaItem(MediaItemID),
    PlayedAt DATETIME DEFAULT GETDATE()
);

/* 10. Bảng MediaShare  */
CREATE TABLE MediaShare(
    ShareID INT IDENTITY(1,1) PRIMARY KEY,
    SenderID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID), 
    ReceiverID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID), 
    MediaItemID INT NULL FOREIGN KEY REFERENCES MediaItem(MediaItemID), 
    PlaylistID INT NULL FOREIGN KEY REFERENCES Playlist(PlaylistID), 
    SharedAt DATETIME DEFAULT GETDATE()
);

/* 11. Bảng Follow  */
CREATE TABLE Follow(
    FollowID INT IDENTITY(1,1) PRIMARY KEY,
    FollowerID NVARCHAR(450) FOREIGN KEY REFERENCES AspNetUsers(UserID),
    FollowingUserID NVARCHAR(450) NULL FOREIGN KEY REFERENCES AspNetUsers(UserID),
    FollowingArtistID INT NULL FOREIGN KEY REFERENCES Artist(ArtistID)
);