/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0C1116',
          50: '#F4F5F6',
          100: '#E4E7EA',
          200: '#B9C2CB',
          300: '#8D99A6',
          400: '#5E6C79',
          500: '#3B4652',
          600: '#262F38',
          700: '#1A2129',
          800: '#141B23',
          900: '#0C1116',
          950: '#070A0D',
        },
        parchment: {
          DEFAULT: '#E7E1D2',
          50: '#FAF8F3',
          100: '#F2EFE6',
          200: '#E7E1D2',
          300: '#D6CCB4',
          400: '#C2B393',
        },
        brass: {
          DEFAULT: '#C9A15C',
          50: '#F8F1E3',
          100: '#EEDCB4',
          200: '#DFC088',
          300: '#C9A15C',
          400: '#B08544',
          500: '#8C6934',
        },
        teal: {
          DEFAULT: '#2F6F6B',
          50: '#E8F2F1',
          100: '#C2DEDB',
          200: '#8FC1BC',
          300: '#5A9C97',
          400: '#2F6F6B',
          500: '#1F4B4C',
          600: '#153534',
        },
        coral: {
          DEFAULT: '#E2603F',
          400: '#E2603F',
          500: '#C74A2C',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        graticule:
          'linear-gradient(rgba(201,161,92,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,161,92,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        graticule: '48px 48px',
      },
      boxShadow: {
        stamp: '0 1px 0 rgba(231,225,210,0.06), 0 12px 32px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(201,161,92,0.25), 0 8px 24px -8px rgba(201,161,92,0.35)',
      },
      animation: {
        'spin-slow': 'spin 14s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: 0.55, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.15)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(6px, -8px)' },
        },
      },
    },
  },
  plugins: [],
}
