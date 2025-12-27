const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.neutral['950'],
      white: colors.neutral['50'],
      gray: {
        DEFAULT: colors.neutral['500'],
        ...colors.neutral,
      },
      green: {
        DEFAULT: colors.emerald['500'],
        ...colors.emerald,
      },
      purple: {
        DEFAULT: colors.indigo['500'],
        ...colors.indigo,
      },
      yellow: {
        DEFAULT: colors.amber['500'],
        ...colors.amber,
      },
      red: {
        DEFAULT: colors.rose['500'],
        ...colors.rose,
      },
      blue: {
        DEFAULT: colors.blue['500'],
        ...colors.blue,
      },
    },
  },
  plugins: [],
}
