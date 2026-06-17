import type { UserSearchResult } from "../../api/userApi";
import SearchUserCard from "./SearchUserCard";

const SearchUserSection = ({ users }: { users: UserSearchResult[] }) => {
  if (users.length === 0) return null;

  return (
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
        {users.map((user) => (
          <SearchUserCard key={user.userID} user={user} />
        ))}
      </div>
    </section>
  );
};

export default SearchUserSection;