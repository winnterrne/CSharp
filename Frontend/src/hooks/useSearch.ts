import { useEffect, useState } from "react";
import { mediaApi } from "../api/mediaApi";

export interface SearchResult {
  id: number;
  title: string;
  artist?: string;
  artistName?: string;
  thumbnail?: string;
  coverUrl?: string;
  imageUrl?: string;
}

export const useSearch = (keyword: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!keyword.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const res = await mediaApi.getSearch(keyword);
        setResults(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  return { results, loading, error };
};