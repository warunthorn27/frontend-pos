/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },

        /* progress bar animation */
        progressMove: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },

      animation: {
        shimmer: "shimmer 2.5s infinite",

        /* progress animation */
        progressMove: "progressMove 1.2s linear infinite",
      },
    },
  },

  plugins: [],
};
