import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        streamify: {
          "primary": "#22c55e",           // Deep Green-500
          "primary-focus": "#16a34a",      // Deep Green-600
          "primary-content": "#ffffff",    // White text on primary
          
          "secondary": "#4ade80",          // Green-400
          "secondary-focus": "#22c55e",    // Green-500
          "secondary-content": "#1f2937",  // Dark text on secondary
          
          "accent": "#059669",             // Deep Emerald-600
          "accent-focus": "#047857",       // Deep Emerald-700
          "accent-content": "#ffffff",     // White text on accent
          
          "neutral": "#1f2937",            // Gray-800 (dark)
          "neutral-focus": "#111827",      // Gray-900 (darker)
          "neutral-content": "#f9fafb",    // Gray-50 (light text)
          
          "base-100": "#ffffff",           // White background (Day mode)
          "base-200": "#f9fafb",           // Gray-50 (very light gray)
          "base-300": "#e5e7eb",           // Gray-200 (light gray)
          "base-content": "#1f2937",       // Gray-800 (dark text)
          
          "info": "#3b82f6",               // Blue-500
          "success": "#10b981",            // Emerald-500
          "warning": "#f59e0b",            // Amber-500
          "error": "#ef4444",              // Red-500
        },
      },
    ],
  },
};
