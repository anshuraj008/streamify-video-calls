import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "streamify", // Fixed custom green theme
  setTheme: (theme) => {
    // Theme is now fixed, but keeping the function for compatibility
    set({ theme: "streamify" });
  },
}));
