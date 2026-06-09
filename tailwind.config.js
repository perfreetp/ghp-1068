/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        museum: {
          darkgreen: '#1a3c34',
          brass: '#c9a85c',
          cream: '#f5f0e1',
          alert: '#e07856',
          brown: '#4a3728',
          slateblue: '#6b8a9e',
          wine: '#8b3a3a',
          parchment: '#ede4d0',
          ink: '#2c2416',
          gold: '#daa520',
          bronze: '#cd7f32'
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace']
      },
      backgroundImage: {
        'parchment': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
        'wood': "linear-gradient(135deg, #4a3728 0%, #6b4423 50%, #4a3728 100%)",
        'cork': "radial-gradient(circle at 20% 30%, #8b7355 0%, #6b5344 100%)"
      },
      boxShadow: {
        'card': '0 4px 20px rgba(26, 60, 52, 0.15)',
        'card-hover': '0 8px 30px rgba(201, 168, 92, 0.25)',
        'glow-brass': '0 0 15px rgba(201, 168, 92, 0.4)',
        'inner-wood': 'inset 0 2px 8px rgba(0,0,0,0.3)',
        'exhibit': '0 0 25px rgba(201, 168, 92, 0.3), inset 0 0 10px rgba(245, 240, 225, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scan': 'scan 2s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        scan: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        }
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    },
  },
  plugins: [],
};
