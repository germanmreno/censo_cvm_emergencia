/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cvm: {
          primary: '#8FA463',
          'primary-dark': '#7A8E54',
          secondary: '#0E2A47',
          'secondary-light': '#1A3F66',
          accent: '#E8DCC4',
          background: '#FAF8F2',
          emergency: '#B91C1C',
          'emergency-dark': '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['Georama', 'system-ui', 'sans-serif'],
        display: ['Georama', 'system-ui', 'sans-serif'],
        serif: ['Georama', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
