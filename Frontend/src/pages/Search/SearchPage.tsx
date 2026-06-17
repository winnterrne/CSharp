import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useSearch } from "../../hooks/useSearch";
import SearchTopResult from "./SearchTopResult";
import SearchResultCard from "./SearchResultCard";
import SearchUserSection from "./SearchUserSection";

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
          <SearchUserSection users={users} />
        )}
        </>
      )}
    </main>
  );
};

export default SearchPage;