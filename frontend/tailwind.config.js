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
          "primary": "#2563EB",           // Accent Blue
          "primary-focus": "#1E3A8A",      // Secondary Blue
          "primary-content": "#ffffff",    // White text on primary
          
          "secondary": "#3B82F6",          // Blue-500
          "secondary-focus": "#2563EB",    // Accent Blue
          "secondary-content": "#1f2937",  // Dark text on secondary
          
          "accent": "#1E3A8A",             // Secondary Blue
          "accent-focus": "#0B1F4B",       // Primary Background Blue
          "accent-content": "#ffffff",     // White text on accent
          
          "neutral": "#1f2937",            // Gray-800 (dark)
          "neutral-focus": "#111827",      // Gray-900 (darker)
          "neutral-content": "#f9fafb",    // Gray-50 (light text)
          
          "base-100": "#ffffff",           // White background (Day mode)
          "base-200": "#f9fafb",           // Gray-50 (very light gray)
          "base-300": "#e5e7eb",           // Gray-200 (light gray)
          "base-content": "#1f2937",       // Gray-800 (dark text)
          
          "info": "#3b82f6",               // Blue-500
          "success": "#2563EB",            // Accent Blue
          "warning": "#f59e0b",            // Amber-500
          "error": "#ef4444",              // Red-500
        },
      },
    ],
  },
};
