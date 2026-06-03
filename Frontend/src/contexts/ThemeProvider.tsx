import { useState } from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }: { children: ReactNode })  => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};