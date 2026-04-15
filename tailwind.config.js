/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#FF00FF',
          blue: '#00FFFF',
          green: '#00FF00',
          yellow: '#FFFF00',
        },
        retro: {
          window: '#C0C0C0',
          titlebar: '#000080',
          text: '#000000',
          button: '#C0C0C0',
        },
      },
      fontFamily: {
        pixel: ['Courier New', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
      },
    },
  },
  plugins: [],
}