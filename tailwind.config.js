/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        heading: ['Barlow Condensed', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        ui:      ['DM Sans', 'sans-serif'],
      },
      colors: {
        arcade: {
          blue:      '#0074e4',
          'blue-bright': '#2196f3',
          gold:      '#f5c842',
          'gold-dim':'#c9a22e',
          red:       '#e8192c',
          emerald:   '#00d68f',
          cyan:      '#00d4e8',
          void:      '#0a0a0a',
          primary:   '#0f0f0f',
          secondary: '#141414',
          card:      '#1a1a1a',
          surface:   '#242424',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gaming-grid": "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'pulse-gold':  'pulseGold 3s ease-in-out infinite',
        'shimmer':     'shimmer 3s linear infinite',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(245,200,66,0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(245,200,66,0.45)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },
      boxShadow: {
        'blue':   '0 0 30px rgba(0,116,228,0.25), 0 0 80px rgba(0,116,228,0.06)',
        'gold':   '0 0 30px rgba(245,200,66,0.2),  0 0 80px rgba(245,200,66,0.06)',
        'card':   '0 4px 24px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
        'premium':'0 24px 70px rgba(0,0,0,0.8)',
      },
      borderRadius: {
        'epic': '4px',
      },
    },
  },
  plugins: [],
};
