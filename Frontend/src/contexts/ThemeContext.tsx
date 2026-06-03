import { createContext } from "react";

export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);