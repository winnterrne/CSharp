// src/hooks/useAiDescription.ts
import { useState, useCallback } from "react";
import { aiApi } from "../api/aiApi";

type Status = "idle" | "loading" | "success" | "error";

interface AiDescriptionState {
  status: Status;
  description: string | null;
  errorMessage: string | null;
}

export function useAiDescription() {
  const [state, setState] = useState<AiDescriptionState>({
    status: "idle",
    description: null,
    errorMessage: null,
  });

  const fetchDescription = useCallback(async (mediaId: number) => {
    setState({ status: "loading", description: null, errorMessage: null });
    try {
      const res = await aiApi.getDescription(mediaId);
      // Tuỳ backend trả về shape gì, điều chỉnh ở đây
      const description = res.data?.description ?? res.data?.data?.description ?? "";
      setState({ status: "success", description, errorMessage: null });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Không thể tải mô tả AI.";
      setState({ status: "error", description: null, errorMessage: msg });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", description: null, errorMessage: null });
  }, []);

  return { ...state, fetchDescription, reset };
}