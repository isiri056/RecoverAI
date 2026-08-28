/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#090B10',
          secondary: '#0F121A',
          tertiary: '#141824',
          card: '#111420',
          'card-hover': '#161B2B',
          elevated: '#181D2E',
        },
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          glow: 'rgba(139, 92, 246, 0.25)',
        },
        emerald: {
          DEFAULT: '#10B981',
          500: '#10B981',
          600: '#059669',
          glow: 'rgba(16, 185, 129, 0.2)',
        },
        amber: {
          DEFAULT: '#F59E0B',
          500: '#F59E0B',
          600: '#D97706',
          glow: 'rgba(245, 158, 11, 0.2)',
        },
        danger: {
          DEFAULT: '#EF4444',
          500: '#EF4444',
          600: '#DC2626',
          glow: 'rgba(239, 68, 68, 0.2)',
        },
        border: {
          subtle: '#1C2233',
          DEFAULT: '#242B42',
          focus: '#4338CA',
          brand: 'rgba(139, 92, 246, 0.4)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
          dim: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.6), 0 0 15px 1px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.25)',
        'glow-brand': '0 0 25px -3px rgba(139, 92, 246, 0.35)',
        'glow-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 25px -3px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beacon': 'beacon 2s ease-in-out infinite',
      },
      keyframes: {
        beacon: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
}
