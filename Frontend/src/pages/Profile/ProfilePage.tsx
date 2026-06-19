import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams} from "react-router-dom";

import { playlistApi } from "../../api/playlistApi";
import { interactionApi } from "../../api/interactionApi";
import type { Playlist, PlaylistDetailDto } from "../../types/playlist";
import { mapPlaylistDetailDtoToPlaylist } from "../../types/playlist";
import { userApi } from "../../api/userApi";

interface FollowedUser {
  userID?: string;
  userId?: string;
  UserID?: string;

  userName?: string;
  UserName?: string;
  name?: string;

  userImage?: string | null;
  UserImage?: string | null;

  email?: string;
  Email?: string;

  role?: string;
  Role?: string;

  phone?: string;
  Phone?: string;
}

const userImageBaseUrl = "http://localhost:5081/media/images/users/";

const getPlaylistId = (item: any) =>
  item.playlistID ?? item.playlistId ?? item.PlaylistID ?? item.id ?? 0;

const mapBasicPlaylist = (item: any): Playlist => {
  const playlistId = getPlaylistId(item);

  return {
    id: playlistId,
    playlistID: playlistId,
    name:
      item.playlistName ??
      item.PlaylistName ??
      item.name ??
      "Playlist chưa có tên",
    playlistName:
      item.playlistName ??
      item.PlaylistName ??
      item.name ??
      "Playlist chưa có tên",
    description: item.description ?? item.Description ?? "",
    coverUrl: item.coverUrl ?? item.CoverUrl ?? "",
    tracks: item.tracks ?? [],
    trackCount: item.trackCount ?? item.TrackCount ?? item.tracks?.length ?? 0,
    isPublic: item.isPublic ?? item.IsPublic ?? item.ispublic ?? true,
    userName: item.userName ?? item.UserName,
    ownerName: item.ownerName ?? item.OwnerName,
    user: item.user,
  };
};

const ProfilePage = () => {
  const navigate = useNavigate();
   const { userId } = useParams<{  userId?: string }>();
   const isOwnProfile = !userId;

  const [profileUser, setProfileUser] = useState<{
    userName?: string;
    userImage?: string | null;
  } | null>(null);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const publicPlaylists = useMemo(
    () => playlists.filter((item) => item.isPublic),
    [playlists],
  );

  const privatePlaylists = useMemo(
    () => playlists.filter((item) => !item.isPublic),
    [playlists],
  );

  useEffect(() => {
    const loadProfilePageData = async () => {
      try {
        setLoading(true);
        setError("");

        if (isOwnProfile) {
          // === PROFILE CỦA MÌNH: giữ nguyên logic cũ ===
            const [playlistRes, followedRes] = await Promise.all([
              playlistApi.getMyPlaylists(),
              interactionApi.getFollowedUsers(),
            ])

            const rawPlaylists =
              Array.isArray(playlistRes.data?.data)
                ? playlistRes.data.data
                : Array.isArray(playlistRes.data?.data?.playlists)
                  ? playlistRes.data.data.playlists
                  : Array.isArray(playlistRes.data?.playlists)
                    ? playlistRes.data.playlists
                    : Array.isArray(playlistRes.data)
                      ? playlistRes.data
                      : [];

            const basicPlaylists = rawPlaylists.map(mapBasicPlaylist);

            // ✅ FIX: lấy lại detail từng playlist để isPublic luôn mới nhất
            const playlistsWithLatestStatus = await Promise.all(
              basicPlaylists.map(async (playlist) => {
                try {
                  const detailRes = await playlistApi.getById(playlist.id);

                  const detailRaw = detailRes.data?.data ?? detailRes.data;

                  const detail = mapPlaylistDetailDtoToPlaylist(
                    detailRaw as PlaylistDetailDto,
                  );

                  return {
                    ...playlist,
                    ...detail,
                    id: playlist.id,
                    playlistID: playlist.id,
                    trackCount: detail.trackCount ?? playlist.trackCount ?? 0,
                  };
                } catch (error) {
                  console.error("LOAD PLAYLIST DETAIL IN PROFILE ERROR:", error);
                  return playlist;
                }
              }),
            );

            const rawFollowedUsers =
              Array.isArray(followedRes.data?.data)
                ? followedRes.data.data
                : Array.isArray(followedRes.data)
                  ? followedRes.data
                  : [];

            setPlaylists(playlistsWithLatestStatus);
            setFollowedUsers(rawFollowedUsers);
          } else {
              // === PROFILE NGƯỜI KHÁC: fetch theo id ===
            const [userRes, playlistRes] = await Promise.all([
              userApi.getProfile(userId!),
              playlistApi.getPublicByUserId(userId!),
            ]);

            const userData = userRes.data?.data ?? userRes.data;
            setProfileUser(userData);

            const rawPlaylists =
              Array.isArray(playlistRes.data?.data)
                ? playlistRes.data.data
                : Array.isArray(playlistRes.data)
                  ? playlistRes.data
                  : [];

            setPlaylists(rawPlaylists.map(mapBasicPlaylist));
            setFollowedUsers([]);
          }
          
        } catch (err : any) {
          console.error("CHI TIẾT LỖI:", {
            message: err?.message,
            status: err?.response?.status,
            data: err?.response?.data,
            isOwnProfile,
            userId,
          });
          setError("Không tải được dữ liệu hồ sơ.");
      } finally {
        setLoading(false);
      }
    };

    loadProfilePageData();
  }, [userId]);

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#121212",
        color: "#fff",
        boxSizing: "border-box",
        paddingBottom: "120px",
      }}
    >
      <section
        style={{
          minHeight: "230px",
          padding: "48px 32px 28px",
          display: "flex",
          alignItems: "flex-end",
          background:
            "linear-gradient(180deg, #4a4a4a 0%, #242424 55%, #121212 100%)",
        }}
      >
        <div>
          <div style={{ color: "#fff", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>
            Hồ sơ
          </div>

          <h1 style={{ fontSize: "clamp(42px, 7vw, 82px)", lineHeight: 1, margin: 0, fontWeight: 900 }}>
            {isOwnProfile
              ? "Playlist của tôi"
              : profileUser?.userName ?? "Người dùng"}
          </h1>

          <p style={{ color: "#b3b3b3", marginTop: "16px", fontSize: "15px" }}>
            {isOwnProfile
              ? `${playlists.length} playlist • ${publicPlaylists.length} công khai • ${privatePlaylists.length} riêng tư • ${followedUsers.length} đang theo dõi`
              : "Hồ sơ người dùng"}
          </p>
        </div>
      </section>

      <section style={{ padding: "28px 32px" }}>
        {loading && <p style={{ color: "#b3b3b3" }}>Đang tải hồ sơ...</p>}

        {error && <p style={{ color: "#ff7676" }}>{error}</p>}

        {!loading && !error && (
          <>
            {isOwnProfile ? (
              <>
                <FollowedUsersSection users={followedUsers} />

                {playlists.length === 0 ? (
                  <div
                    style={{
                      minHeight: "300px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      color: "#b3b3b3",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "64px", marginBottom: "14px" }}>🎵</div>
                    <h2 style={{ color: "#fff" }}>Bạn chưa có playlist nào</h2>
                    <p>Hãy tạo playlist từ Sidebar để bắt đầu lưu nhạc.</p>
                  </div>
                ) : (
                  <>
                    <PlaylistSection
                      title="Playlist công khai"
                      playlists={publicPlaylists}
                      onOpen={(id) => navigate(`/playlist/${id}`)}
                    />
                    <PlaylistSection
                      title="Playlist riêng tư"
                      playlists={privatePlaylists}
                      onOpen={(id) => navigate(`/playlist/${id}`)}
                    />
                  </>
                )}
              </>
            ) : (
              // profile người khác
              <div style={{ paddingTop: "20px" }}>
                {profileUser ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "36px",
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          background: "#282828",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "40px",
                          flexShrink: 0,
                        }}
                      >
                        {profileUser.userImage ? (
                          <img
                            src={
                              profileUser.userImage.startsWith("http")
                                ? profileUser.userImage
                                : `http://localhost:5081/media/images/users/${profileUser.userImage}`
                            }
                            alt={profileUser.userName}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          "👤"
                        )}
                      </div>
                      <div>
                        <p style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0 }}>
                          {profileUser.userName}
                        </p>
                        <p style={{ color: "#b3b3b3", fontSize: "14px", margin: "4px 0 0" }}>
                          {playlists.length} playlist công khai
                        </p>
                      </div>
                    </div>

                    {playlists.length > 0 && (
                      <PlaylistSection
                        title="Playlist công khai"
                        playlists={playlists}
                        onOpen={(id) => navigate(`/playlist/${id}`)}
                      />
                    )}

                    {playlists.length === 0 && (
                      <div style={{ color: "#b3b3b3" }}>
                        Người dùng này chưa có playlist công khai nào.
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ color: "#b3b3b3" }}>Không tìm thấy người dùng.</p>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

const FollowedUsersSection = ({ users }: { users: FollowedUser[] }) => {
  const getUserId = (user: FollowedUser) =>
    user.userID ?? user.userId ?? user.UserID ?? "";

  const getUserName = (user: FollowedUser) =>
    user.userName ?? user.UserName ?? user.name ?? "Người dùng";

  const getUserImage = (user: FollowedUser) =>
    user.userImage ?? user.UserImage ?? "";

  return (
    <section style={{ marginBottom: "42px" }}>
      <h2
        style={{
          fontSize: "26px",
          margin: "0 0 18px",
          color: "#fff",
        }}
      >
        Đang theo dõi
      </h2>

      {users.length === 0 ? (
        <div
          style={{
            background: "#181818",
            borderRadius: "12px",
            padding: "22px",
            color: "#b3b3b3",
          }}
        >
          Bạn chưa theo dõi người dùng nào.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: "18px",
          }}
        >
          {users.map((user) => {
            const userId = getUserId(user);
            const userName = getUserName(user);
            const imageName = getUserImage(user);

            const avatar =
              imageName && !imageName.startsWith("http")
                ? `${userImageBaseUrl}${imageName}`
                : imageName;

            return (
              <div
                key={userId || userName}
                style={{
                  background: "#181818",
                  borderRadius: "12px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: ".18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#282828";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#181818";
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    background: "#282828",
                    marginBottom: "14px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#b3b3b3",
                    fontSize: "48px",
                  }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={userName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                <div
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "15px",
                    marginBottom: "6px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userName}
                </div>

                <div
                  style={{
                    color: "#b3b3b3",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Hồ sơ người dùng
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const PlaylistSection = ({
  title,
  playlists,
  onOpen,
}: {
  title: string;
  playlists: Playlist[];
  onOpen: (id: number) => void;
}) => {
  return (
    <section style={{ marginBottom: "42px" }}>
      <h2
        style={{
          fontSize: "26px",
          margin: "0 0 18px",
          color: "#fff",
        }}
      >
        {title}
      </h2>

      {playlists.length === 0 ? (
        <div
          style={{
            background: "#181818",
            borderRadius: "12px",
            padding: "22px",
            color: "#b3b3b3",
          }}
        >
          Chưa có playlist nào trong mục này.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: "18px",
          }}
        >
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onOpen(playlist.id)}
              style={{
                background: "#181818",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
                transition: ".18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#282828";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#181818";
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "8px",
                  background: "#282828",
                  marginBottom: "14px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#b3b3b3",
                  fontSize: "48px",
                }}
              >
                {playlist.coverUrl ? (
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name ?? playlist.playlistName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "♪"
                )}
              </div>

              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "15px",
                  marginBottom: "6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {playlist.name ?? playlist.playlistName}
              </div>

              <div
                style={{
                  color: "#b3b3b3",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {playlist.isPublic ? "Công khai" : "Riêng tư"} •{" "}
                {playlist.trackCount ?? playlist.tracks.length} bài hát
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProfilePage;