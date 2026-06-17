import type { Media } from "../../types/media";
import SearchResultCard from "./SearchResultCard";

const SearchMediaSection = ({
  title,
  items,
}: {
  title: string;
  items: Media[];
}) => {
  if (items.length === 0) return null;

  return (
    <section style={{ marginBottom: "38px" }}>
      <h2
        style={{
          fontSize: "24px",
          marginBottom: "16px",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "grid",
          gap: "10px",
        }}
      >
        {items.map((item) => (
          <SearchResultCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default SearchMediaSection;