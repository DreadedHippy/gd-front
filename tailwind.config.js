/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#ffffff',
        'background': '#344256',
        'primary': '#120d4b',
        'secondary': '#181632',
        'accent': '#645cb7',
      },
    },
  },
  plugins: [],
}