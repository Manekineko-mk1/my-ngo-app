/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ngoGreen: "#228B22", // Easily use 'bg-ngoGreen' or 'text-ngoGreen'
      },
    },
  },
  plugins: [],
};