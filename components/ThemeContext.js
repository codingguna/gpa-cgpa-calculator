// src/ThemeContext.js
import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme } from "./theme";

export const ThemeContext = createContext({
  theme: LightTheme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(LightTheme);

  // Load saved theme from storage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("app_theme");
      if (saved === "dark") setTheme(DarkTheme);
      if (saved === "light") setTheme(LightTheme);
    })();
  }, []);

  // Toggle theme + save to storage
  const toggleTheme = async () => {
    setTheme((prev) => {
      const next = prev.mode === "light" ? DarkTheme : LightTheme;
      AsyncStorage.setItem("app_theme", next.mode); // Save
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
