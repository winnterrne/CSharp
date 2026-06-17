import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useSearch } from "../../hooks/useSearch";
import SearchTopResult from "./SearchTopResult";
import SearchResultCard from "./SearchResultCard";

import { userApi, type UserSearchResult } from "../../api/userApi";

type SearchFilter = "all" | "song" | "artist" | "album" | "user";

const tabs: {
  key: SearchFilter;
  label: string;
}[] = [
  { key: "all", label: "Tất cả" },
  { key: "song", label: "Bài hát" },
  { key: "artist", label: "Nghệ sĩ" },
  { key: "album", label: "Album" },
  { key: "user", label: "Người dùng" },
];

const buildUserImageUrl = (img?: string | null) => {
  if (!img) return undefined;

  if (img.startsWith("http")) return img;

  if (img.startsWith("/")) return `http://localhost:5081${img}`;

  if (img.includes("/")) return `http://localhost:5081/${img}`;

  return `http://localhost:5081/media/images/user/${img}`;
};

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  const [filter, setFilter] = useState<SearchFilter>("all");

  const { search, searchResults, isLoading, error } = useSearch();

  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setUserError("");
      return;
    }

    search(query);

    const loadUsers = async () => {
      try {
        setUserLoading(true);
        setUserError("");

        const res = await userApi.search(query);

        console.log("SEARCH USER RESPONSE:", res.data);

        const body = res.data as any;

        const data =
          Array.isArray(body) ? body :
          Array.isArray(body?.data) ? body.data :
          Array.isArray(body?.data?.items) ? body.data.items :
          Array.isArray(body?.items) ? body.items :
          [];

        console.log("SEARCH USER DATA:", data);

        setUsers(data);
      } catch (err: any) {
        console.error("SEARCH USER ERROR:", err);
        console.error("STATUS:", err.response?.status);
        console.error("DATA:", err.response?.data);

        setUsers([]);
        setUserError("Không tìm được người dùng.");
      } finally {
        setUserLoading(false);
      }
    };

    loadUsers();
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

  const showMediaSection = filter === "all" || filter !== "user";
  const showUserSection = filter === "all" || filter === "user";

  const hasMediaResults = filteredResults.length > 0;
  const hasUserResults = users.length > 0;

  const hasAnyResult =
    filter === "user" ? hasUserResults
    : filter === "all" ? hasMediaResults || hasUserResults
    : hasMediaResults;

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

      {(isLoading || userLoading) && (
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

      {userError && filter === "user" && (
        <p
          style={{
            color: "#ff4d4f",
          }}
        >
          {userError}
        </p>
      )}

      {!isLoading && !userLoading && query.trim() && !hasAnyResult && (
        <div
          style={{
            color: "#b3b3b3",
            marginTop: "40px",
          }}
        >
          Không tìm thấy kết quả phù hợp.
        </div>
      )}

      {!isLoading && !userLoading && hasAnyResult && (
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
                {filter === "all" ?
                  "Bài hát"
                : tabs.find((t) => t.key === filter)?.label}
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

          {showUserSection && hasUserResults && (
            <section>
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                Người dùng
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "14px",
                }}
              >
                {users.map((user: any) => {
                  const userId = user.userID ?? user.userId ?? user.id;
                  const userName = user.userName ?? user.username ?? user.name ?? "Unknown User";
                  const userImage = user.userImage ?? user.avatarUrl ?? user.imageUrl ?? null;
                  const avatarUrl = buildUserImageUrl(userImage);
                  const initial = userName.trim().charAt(0).toUpperCase() || "?";

                  return (
                    <div
                      key={userId}
                      style={{
                        background: "#181818",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        border: "1px solid #242424",
                      }}
                    >
                      <div
                        style={{
                          width: "54px",
                          height: "54px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "#333",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 900,
                          fontSize: "20px",
                        }}
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={userName}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          initial
                        )}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: "15px",
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
                            marginTop: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.email ?? "Chưa có email"}
                        </div>

                        <div
                          style={{
                            color: "#777",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {user.role ?? "User"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default SearchPage;