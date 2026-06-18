import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useSearch } from "../../hooks/useSearch";
import SearchTopResult from "./SearchTopResult";
import SearchResultCard from "./SearchResultCard";
import SearchUserSection from "./SearchUserSection";
import SearchArtistSection from "./SearchArtistSection";
import SearchPlaylistCard from "./SearchPlaylistCard";

import { userApi, type UserSearchResult } from "../../api/userApi";
import { artistApi, type ArtistSearchResult } from "../../api/artistApi";
import {
  playlistApi,
  type PlaylistSearchResult,
} from "../../api/playlistApi";

type SearchFilter = "all" | "song" | "artist" | "user" | "playlist";

const tabs: {
  key: SearchFilter;
  label: string;
}[] = [
  { key: "all", label: "Tất cả" },
  { key: "song", label: "Bài hát" },
  { key: "artist", label: "Nghệ sĩ" },
  { key: "playlist", label: "Playlist" },
  { key: "user", label: "Người dùng" },
];

type RawUserSearchResult = Partial<UserSearchResult> & {
  UserID?: string;
  UserName?: string;
  UserImage?: string | null;
  Email?: string;
  Role?: string;
  Phone?: string;
  id?: string;
  username?: string;
  avatarUrl?: string | null;
  imageUrl?: string | null;
};

const normalizeUser = (user: RawUserSearchResult): UserSearchResult => {
  return {
    userID: user.userID ?? user.UserID ?? user.id ?? "",
    userName:
      user.userName ?? user.UserName ?? user.username ?? "Unknown User",
    userImage:
      user.userImage ??
      user.UserImage ??
      user.avatarUrl ??
      user.imageUrl ??
      null,
    email: user.email ?? user.Email ?? "",
    role: user.role ?? user.Role ?? "User",
    phone: user.phone ?? user.Phone ?? "",
  };
};

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  const [filter, setFilter] = useState<SearchFilter>("all");

  const { search, searchResults, isLoading, error } = useSearch();

  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [artists, setArtists] = useState<ArtistSearchResult[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistSearchResult[]>([]);

  const [extraLoading, setExtraLoading] = useState(false);
  const [extraError, setExtraError] = useState("");

  useEffect(() => {
    const value = query.trim();

    if (!value) {
      setUsers([]);
      setArtists([]);
      setPlaylists([]);
      setExtraError("");
      return;
    }

    search(value);

    const loadExtraSearch = async () => {
      try {
        setExtraLoading(true);
        setExtraError("");

        const [userRes, artistRes, playlistRes] = await Promise.all([
          userApi.search(value),
          artistApi.search(value),
          playlistApi.search(value),
        ]);

        const userBody = userRes.data as any;

        const rawUsers: RawUserSearchResult[] =
          Array.isArray(userBody) ? userBody :
          Array.isArray(userBody?.data) ? userBody.data :
          Array.isArray(userBody?.data?.items) ? userBody.data.items :
          Array.isArray(userBody?.items) ? userBody.items :
          [];

        const normalizedUsers: UserSearchResult[] = rawUsers
          .map((item: RawUserSearchResult) => normalizeUser(item))
          .filter((user: UserSearchResult) => Boolean(user.userID));

        const artistBody = artistRes.data as any;

        const artistItems =
          Array.isArray(artistBody) ? artistBody :
          Array.isArray(artistBody?.data?.artists) ? artistBody.data.artists :
          Array.isArray(artistBody?.data?.Artists) ? artistBody.data.Artists :
          Array.isArray(artistBody?.data?.items) ? artistBody.data.items :
          Array.isArray(artistBody?.data?.Items) ? artistBody.data.Items :
          Array.isArray(artistBody?.data) ? artistBody.data :
          Array.isArray(artistBody?.artists) ? artistBody.artists :
          Array.isArray(artistBody?.Artists) ? artistBody.Artists :
          Array.isArray(artistBody?.items) ? artistBody.items :
          Array.isArray(artistBody?.Items) ? artistBody.Items :
          [];

        const playlistItems = Array.isArray(playlistRes.data?.data)
          ? playlistRes.data.data
          : [];

        console.log("SEARCH USERS:", normalizedUsers);
        console.log("SEARCH ARTISTS:", artistItems);
        console.log("SEARCH PLAYLISTS:", playlistItems);

        setUsers(normalizedUsers);
        setArtists(artistItems);
        setPlaylists(playlistItems);
      } catch (err) {
        console.error("SEARCH EXTRA ERROR:", err);

        setUsers([]);
        setArtists([]);
        setPlaylists([]);
        setExtraError("Không tìm được user, nghệ sĩ hoặc playlist.");
      } finally {
        setExtraLoading(false);
      }
    };

    loadExtraSearch();
  }, [query, search]);

  const filteredResults = useMemo(() => {
    if (filter === "all") return searchResults;

    return searchResults.filter((item) => {
      const itemType = item.type?.toLowerCase();

      if (filter === "song") {
        return (
          itemType === "song" || itemType === "audio" || itemType === "music"
        );
      }

      return itemType === filter;
    });
  }, [filter, searchResults]);

  const hasMediaResults = filteredResults.length > 0;
  const hasUserResults = users.length > 0;
  const hasArtistResults = artists.length > 0;
  const hasPlaylistResults = playlists.length > 0;

  const loading = isLoading || extraLoading;

  const hasAnyResult =
    filter === "user"
      ? hasUserResults
      : filter === "artist"
        ? hasArtistResults || hasMediaResults
        : filter === "playlist"
          ? hasPlaylistResults
          : filter === "all"
            ? hasMediaResults ||
              hasUserResults ||
              hasArtistResults ||
              hasPlaylistResults
            : hasMediaResults;

  const showMediaSection = filter === "all" || filter === "song";
  const showArtistSection = filter === "all" || filter === "artist";
  const showPlaylistSection = filter === "all" || filter === "playlist";
  const showUserSection = filter === "all" || filter === "user";

  return (
    <main
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "30px",
        paddingBottom: "120px",
        color: "#fff",
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #181818 0%, #121212 280px)",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "18px",
        }}
      >
        {query.trim() ? `Kết quả cho "${query}"` : "Tìm kiếm"}
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "26px",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "8px 16px",
              background: filter === tab.key ? "#fff" : "#282828",
              color: filter === tab.key ? "#000" : "#fff",
              cursor: "pointer",
              fontWeight: 700,
              transition: "background .15s, color .15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <p
          style={{
            color: "#b3b3b3",
          }}
        >
          Đang tìm kiếm...
        </p>
      )}

      {error && (
        <p
          style={{
            color: "#ff4d4f",
          }}
        >
          {error}
        </p>
      )}

      {extraError && (
        <p
          style={{
            color: "#ff4d4f",
          }}
        >
          {extraError}
        </p>
      )}

      {!loading && query.trim() && !hasAnyResult && (
        <div
          style={{
            color: "#b3b3b3",
            marginTop: "40px",
          }}
        >
          Không tìm thấy kết quả phù hợp.
        </div>
      )}

      {!loading && hasAnyResult && (
        <>
          {filter === "all" && hasMediaResults && (
            <section style={{ marginBottom: "36px" }}>
              <SearchTopResult item={filteredResults[0]} />
            </section>
          )}

          {showMediaSection && hasMediaResults && (
            <section style={{ marginBottom: "38px" }}>
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                Bài hát
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                }}
              >
                {filteredResults.map((item) => (
                  <SearchResultCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {showArtistSection && hasArtistResults && (
            <SearchArtistSection artists={artists} />
          )}

          {showPlaylistSection && hasPlaylistResults && (
            <section style={{ marginBottom: "38px" }}>
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                Playlist
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "14px",
                }}
              >
                {playlists.map((playlist) => (
                  <SearchPlaylistCard
                    key={playlist.playlistID}
                    playlist={playlist}
                  />
                ))}
              </div>
            </section>
          )}

          {showUserSection && hasUserResults && (
            <SearchUserSection users={users} />
          )}
        </>
      )}
    </main>
  );
};

export default SearchPage;