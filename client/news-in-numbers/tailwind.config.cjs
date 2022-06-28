/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
      fontFamily: {
        sans: ["Libre Franklin", "sans-serif"]
      },
      extend: {
        keyframes: {
          up: {
            "100%": { transform: "translateY(-5px)" }
          },
          down: {
            "0%": { transform: "translateY(-5px)" }
          }
        }
      }
  },
  plugins: [
      require("@tailwindcss/line-clamp"),
  ],
}
