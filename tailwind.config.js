/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D92054',      // Brand main CTA color (Ruby Red)
        secondary: '#27B0B2',    // Accent for buttons or badges (Aqua Teal)
        accent: '#F88379',       // Subtle highlight areas (Coral Pink)
        purple: '#915FCA',       // Decorative/feature elements
        black: '#000000',        // Base text, icons
        white: '#F4F4F4',        // Page background
      },
    },
  },
  plugins: [],
};