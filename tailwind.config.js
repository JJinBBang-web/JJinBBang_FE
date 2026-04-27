/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f46940',
        primary80: 'rgba(244, 105, 64, 0.8)',
        yellow: '#feb70c',
        pink: '#ff4967',
        pink30: 'rgba(255, 73, 103, 0.3)',
        blue: '#4492ff',
        blue40: '#d6e7ff',
        blue10: '#ecf4ff',
        indicator: '#171717',
        black: '#171717',
        black30: 'rgba(0, 0, 0, 0.3)',
        black100: '#404653',
        black80: '#666b75',
        black40: '#b2b5ba',
        black30Solid: '#cfd4d8',
        black10: '#eaeef2',
        grayWhite: '#f4f6fa',
        gray10: '#f3f5f9',
        salmon: '#fff5e9',
        background: '#f4f6fa',
        popup: '#cfd4d8',
        unactiveBtn: '#f3f5f9',
        selected: '#fff7f4',
      },
      fontFamily: {
        pretendard: ['PretendardVariable'],
      },
    },
  },
  plugins: [],
};
