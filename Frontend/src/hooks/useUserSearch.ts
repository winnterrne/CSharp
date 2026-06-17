import { useCallback, useState } from "react";
import { userApi, type UserSearchResult } from "../api/userApi";

export const useUserSearch = () => {
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

  const searchUsers = useCallback(async (keyword: string) => {
    const value = keyword.trim();

    if (!value) {
      setUsers([]);
      setUserError("");
      return;
    }

    try {
      setUserLoading(true);
      setUserError("");

      const res = await userApi.search(value);
      const body = res.data as any;

      const data =
        Array.isArray(body) ? body :
        Array.isArray(body?.data) ? body.data :
        Array.isArray(body?.data?.items) ? body.data.items :
        Array.isArray(body?.items) ? body.items :
        [];

      setUsers(data);
    } catch (err) {
      console.error("SEARCH USER ERROR:", err);
      setUsers([]);
      setUserError("Không tìm được người dùng.");
    } finally {
      setUserLoading(false);
    }
  }, []);

  return {
    users,
    userLoading,
    userError,
    searchUsers,
  };
};