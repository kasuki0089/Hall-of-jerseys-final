module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}', './app/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: { 
    extend: {
      colors: {
        primary: {
          light: '#023fc4',
          DEFAULT: '#022F8E',
          dark: '#011d5b',
        },
        secondary: {
          light: '#fde001',
          DEFAULT: '#EFBF04',
          dark: '#b79302',
        },
        gray: {
          100: '#e6e9f0',
          200: '#cdd3e1',
          300: '#aab3cc',
          400: '#555f7d',
          500: '#454f6a',
          600: '#363d56',
          700: '#272f43',
          800: '#181f2e',
          900: '#0a0f1a',
          DEFAULT: '#F1F1F1',
        }
      }
    } 
  },
  plugins: [],
};
