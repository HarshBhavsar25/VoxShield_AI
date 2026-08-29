/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          darkest: '#05070D',
          darker: '#0B0F19',
          card: '#111827',
          cardHover: '#162032',
          border: 'rgba(56, 189, 248, 0.15)',
          borderGlow: 'rgba(56, 189, 248, 0.35)',
          cyan: '#00F2FE',
          cyanGlow: '#4FACFE',
          emerald: '#10B981',
          emeraldGlow: '#34D399',
          amber: '#F59E0B',
          amberGlow: '#FBBF24',
          crimson: '#EF4444',
          crimsonGlow: '#F87171',
          purple: '#8B5CF6',
          purpleGlow: '#A78BFA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'cyber-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.3)',
        'cyber-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'cyber-crimson': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite alternate',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'scanline': 'scanline 8s linear infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(0, 242, 254, 0.2))' }
        },
        waveBar: {
          '0%': { height: '15%' },
          '100%': { height: '100%' }
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
