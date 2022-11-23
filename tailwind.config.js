/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,ts}",
    "./src/**/*.{html,ts}",
    "./src/**/**/*.{html,ts}",
  ], theme: {
    extend: {
      gridTemplateColumns: {
        'max-min': 'max-content, min-content',
      }
    },
  },
  plugins: [],
}
