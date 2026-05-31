import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer phải dùng trong PlayerProvider");
  return ctx;
};
