/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // background gradient colors
          bgStart: '#81A1E0',
          bgMid: '#C3D7F6',
          bgEnd: '#F0F6FF',
          // element decorative
          star: '#FFE2DF',
          // component colors
          surface: '#FFFFFF',
          text: '#000000',
          primary: '#65A9E0',
          secondary: '#E4EDFF',
          accent: '#9EB7E9',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
