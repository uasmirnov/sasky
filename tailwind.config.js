const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*/templates/*/*.html', 
    './*/templates/*/*/*.html',
    './*/templates/*/*/*/*.html',
    './*/*.py',
    './static/js/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'custom-button': '#2B4D6E',
      },
      fontFamily: {
        "sans": ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
  darkMode: 'selector',
}

