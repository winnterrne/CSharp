import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import SearchTopResult from "./SearchTopResult";
import SearchResultCard from "./SearchResultCard";

type SearchFilter = "all" | "song" | "artist" | "album";

const tabs: {
  key: SearchFilter;
  label: string;
}[] = [
  { key: "all", label: "Tất cả" },
  { key: "song", label: "Bài hát" },
  { key: "artist", label: "Nghệ sĩ" },
  { key: "album", label: "Album" },
];

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  // NEW: filter tab cho kết quả tìm kiếm
  const [filter, setFilter] = useState<SearchFilter>("all");

  // FIX: chỉ gọi useSearch 1 lần
  const { search, searchResults, isLoading, error } = useSearch();

  useEffect(() => {
    if (query.trim()) {
      search(query);
    }
  }, [query, search]);

  // NEW: lọc kết quả theo type
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

  const hasResults = filteredResults.length > 0;

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
      {/* HEADER */}
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "18px",
        }}
      >
        {query.trim() ? `Kết quả cho "${query}"` : "Tìm kiếm"}
      </h1>

      {/* NEW: FILTER TABS */}
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

      {/* LOADING */}
      {isLoading && (
        <p
          style={{
            color: "#b3b3b3",
          }}
        >
          Đang tìm kiếm...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p
          style={{
            color: "#ff4d4f",
          }}
        >
          {error}
        </p>
      )}

      {/* EMPTY */}
      {!isLoading && query.trim() && !hasResults && (
        <div
          style={{
            color: "#b3b3b3",
            marginTop: "40px",
          }}
        >
          Không tìm thấy kết quả phù hợp.
        </div>
      )}

      {/* RESULT */}
      {!isLoading && hasResults && (
        <>
          {/* TOP RESULT: chỉ hiện khi tab tất cả */}
          {filter === "all" && (
            <section style={{ marginBottom: "36px" }}>
              <SearchTopResult item={filteredResults[0]} />
            </section>
          )}

          {/* SONG LIST */}
          <section>
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
        </>
      )}
    </main>
  );
};

export default SearchPage;
