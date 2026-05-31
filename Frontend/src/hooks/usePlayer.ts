// src/hooks/usePlayer.ts
import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";
import type { PlayerContextType } from "../contexts/PlayerContext";

export const usePlayer = (): PlayerContextType => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer phải dùng trong <PlayerProvider>");
  return ctx;
};