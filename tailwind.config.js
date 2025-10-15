/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",    // for Vite
    "./src/**/*.{js,jsx,ts,tsx}",  // all React files
  ],
  theme: {
    extend: {
      colors: {
        'antique-white': '#FAEBD7',
        'antique': {
          50: '#FEFCF9',
          100: '#FDF8F1', 
          200: '#FAEBD7',
          300: '#F5E1C4',
          400: '#F0D7B1',
          500: '#EBCD9E',
          600: '#D4B484',
          700: '#BD9B6A',
          800: '#9A7D54',
          900: '#7A6142',
        }
      },
    },
  },
  plugins: [],
}
