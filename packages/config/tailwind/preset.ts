import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        background: '#f4f7f1',
        foreground: '#142013',
        primary: {
          DEFAULT: '#2f6d3b',
          foreground: '#f7fff6'
        },
        muted: {
          DEFAULT: '#d8e4d2',
          foreground: '#3e4f3c'
        },
        card: '#ffffff',
        border: '#c6d5be',
        danger: {
          DEFAULT: '#b42318',
          foreground: '#ffffff'
        }
      },
      borderRadius: {
        lg: '0.9rem'
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(19, 39, 18, 0.45)'
      }
    }
  }
};

export default preset;
