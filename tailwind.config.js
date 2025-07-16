/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Kurzgesagt-inspired color palette
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        // Organ-specific colors
        brain: {
          50: '#f3f0ff',
          100: '#ede9fe',
          500: '#8b5fbf',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        respiratory: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#00bcd4',
          600: '#0891b2',
          700: '#0e7490',
        },
        cardiovascular: {
          50: '#fdf2f8',
          100: '#fce7f3',
          500: '#e91e63',
          600: '#db2777',
          700: '#be185d',
        },
        digestive: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#4caf50',
          600: '#16a34a',
          700: '#15803d',
        },
        skin: {
          50: '#fef7f7',
          100: '#fef2f2',
          500: '#ffb6c1',
          600: '#f87171',
          700: '#ef4444',
        },
        sensory: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#ff9800',
          600: '#f59e0b',
          700: '#d97706',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
