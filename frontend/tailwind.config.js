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
          "primary": "#4ade80",           // Green-400
          "primary-focus": "#22c55e",      // Green-500
          "primary-content": "#ffffff",    // White text on primary
          
          "secondary": "#86efac",          // Green-300
          "secondary-focus": "#4ade80",    // Green-400
          "secondary-content": "#1f2937",  // Dark text on secondary
          
          "accent": "#10b981",             // Emerald-500
          "accent-focus": "#059669",       // Emerald-600
          "accent-content": "#ffffff",     // White text on accent
          
          "neutral": "#1f2937",            // Gray-800 (dark)
          "neutral-focus": "#111827",      // Gray-900 (darker)
          "neutral-content": "#f9fafb",    // Gray-50 (light text)
          
          "base-100": "#ffffff",           // White background
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
