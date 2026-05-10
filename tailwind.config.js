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
        display: ['Syne', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        arcade: {
          gold:    '#f5c842',
          'gold-dim': '#c9a22e',
          cyan:    '#00e5ff',
          violet:  '#7c4dff',
          rose:    '#ff4d6d',
          emerald: '#00d68f',
          orange:  '#ff6b35',
          void:    '#04060d',
          primary: '#070a14',
          card:    '#0d1224',
          surface: '#131b2e',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gaming-grid": "linear-gradient(rgba(245,200,66,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.04) 1px, transparent 1px)",
        "gold-radial": "radial-gradient(ellipse at center, rgba(245,200,66,0.15) 0%, transparent 70%)",
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'pulse-gold':  'pulseGold 2.5s ease-in-out infinite',
        'shimmer':     'shimmer 2s ease-in-out infinite',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(245,200,66,0.25)' },
          '50%':      { boxShadow: '0 0 40px rgba(245,200,66,0.5), 0 0 80px rgba(245,200,66,0.15)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
      boxShadow: {
        'gold':   '0 0 30px rgba(245,200,66,0.2), 0 0 80px rgba(245,200,66,0.06)',
        'cyan':   '0 0 30px rgba(0,229,255,0.2),  0 0 80px rgba(0,229,255,0.06)',
        'violet': '0 0 30px rgba(124,77,255,0.2), 0 0 80px rgba(124,77,255,0.06)',
        'card':   '0 4px 24px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)',
        'premium':'0 24px 70px rgba(0,0,0,0.7), 0 0 40px rgba(245,200,66,0.08)',
      },
    },
  },
  plugins: [],
};
