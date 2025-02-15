/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      sm: { max: '820px' },
      md: { min: '820px' },
      lg: { min: '1510px' },
    },
    extend: {
      colors: {
        default: '#fff',
        primary: "#0e0e0e",
        secondary: "#222",
        "light-gray": "#B4A5B6",
        accent: '#9c27b0',
        positive: '#21ba45',
        negative: '#c10015',
        info: '#31ccec',
        warning: '#f2c037',
        dark: '#1d1d1d',
        'dark-page': '#121212',
      },
      fontFamily: {
        baiJamjuree: ['"Bai Jamjuree"', 'sans-serif'],
      },
      width: {
        '15': '15%',
        '55': '55%',
        '60': '60%',
        '70': '70%',
        '80': '80%',
        '85': '85%',
        '90': '90%',
        '95': '95%',
      },
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      xl: '2rem',
    },
  },
};
