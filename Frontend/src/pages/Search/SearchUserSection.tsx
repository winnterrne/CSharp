import type { UserSearchResult } from "../../api/userApi";
import SearchUserCard from "./SearchUserCard";

const SearchUserSection = ({ users }: { users: UserSearchResult[] }) => {
  if (users.length === 0) return null;

  return (
    <section style={{ marginBottom: "36px" }}>
      <h2
        style={{
          fontSize: "24px",
          marginBottom: "16px",
          color: "#fff",
        }}
      >
        Người dùng
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "14px",
        }}
      >
        {users.map((user, index) => (
          <SearchUserCard
            key={user.userID || index}
            user={user}
          />
        ))}
      </div>
    </section>
  );
};

export default SearchUserSection;