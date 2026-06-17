import {create} from "zustand";
import { aiApi } from "../api/aiApi";

type RecommendationState = {
  aiRecommendations: any[];
  loadingAI: boolean;
  loadAIRecommendations: () => Promise<void>;
};

export const useRecommendationStore = create<RecommendationState>((set) => ({
  aiRecommendations: [],
  loadingAI: false,
  loadAIRecommendations: async () => {
    try {
      set({ loadingAI: true });
      const res = await aiApi.getRecommendations();
      set({ aiRecommendations: res.data.data ?? [] });
    } catch (err) {
      console.error("AI RECOMMEND ERROR", err);
    } finally {
      set({ loadingAI: false });
    }
  },
}));