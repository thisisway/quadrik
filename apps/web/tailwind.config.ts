import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Goldplay', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
      },
      colors: {
        'q-red': '#EF3E3E',
        'q-orange': '#F47A32',
        'q-yellow': '#FFD43B',
        'q-navy': '#071B3A',
        'q-blue': '#0477BF',
        'q-red-light': '#F5A8A8',
        'q-red-dark': '#C72F2F',
        'q-orange-light': '#F9A868',
        'q-orange-dark': '#D46426',
        'q-blue-light': '#4BA3DB',
        'q-blue-dark': '#035699',
        sand: '#FFF9EC',
        'sand-2': '#EFE3C8',
        'sand-3': '#E5D7AA',
        graphite: '#222222',
        gray: '#707070',
        'gray-light': '#A9A9A9',
        'gray-lighter': '#D8D8D8',
        'gray-x-light': '#F0F0F0',
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '28px',
        full: '999px',
      },
      boxShadow: {
        xs: '0 2px 4px rgba(7,27,58,.06)',
        sm: '0 4px 12px rgba(7,27,58,.08)',
        md: '0 12px 30px rgba(7,27,58,.12)',
        lg: '0 18px 50px rgba(7,27,58,.15)',
        xl: '0 28px 60px rgba(7,27,58,.20)',
      },
      backgroundImage: {
        'grad-sun': 'linear-gradient(135deg, #EF3E3E 0%, #F47A32 48%, #FFD43B 100%)',
        'grad-sea': 'linear-gradient(135deg, #071B3A 0%, #0477BF 100%)',
        'grad-sunset': 'linear-gradient(180deg, #F47A32 0%, #EF3E3E 100%)',
        'grad-sky': 'linear-gradient(180deg, #0477BF 0%, #071B3A 100%)',
      },
    },
  },
  plugins: [],
}

export default config
