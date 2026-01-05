import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "streamify", // Fixed custom green theme
  isDarkMode: localStorage.getItem("streamify-dark-mode") === "true" || false,
  
  setTheme: (theme) => {
    // Theme is now fixed, but keeping the function for compatibility
    set({ theme: "streamify" });
  },
  
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem("streamify-dark-mode", String(newDarkMode));
      return { isDarkMode: newDarkMode };
    });
  },
}));
