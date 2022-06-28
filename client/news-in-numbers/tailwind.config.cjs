/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
      fontFamily: {
        sans: ["Libre Franklin", "sans-serif"]
      }
  },
  plugins: [
      require("@tailwindcss/line-clamp"),
  ],
}
