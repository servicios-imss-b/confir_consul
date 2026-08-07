/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1E5B4F',
          dark: '#164739',
          light: '#2E7A68',
        },
        burgundy: {
          DEFAULT: '#9B2247',
          dark: '#7A1936',
        },
        gold: {
          DEFAULT: '#A57F2C',
          dark: '#8A6A22',
          light: '#C99E3D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
