/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Aldrich', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
        themes: ["corporate", "cerberus"],
  },
};
