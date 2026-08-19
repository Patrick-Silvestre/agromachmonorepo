import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#090d0b',
        foreground: '#edf2ee',
        primary: {
          DEFAULT: '#2fd97a',
          foreground: '#04170c'
        },
        muted: {
          DEFAULT: '#141b17',
          foreground: '#93a89c'
        },
        accent: {
          DEFAULT: '#f2b544',
          foreground: '#2b1c02'
        },
        earth: {
          DEFAULT: '#a98862',
          foreground: '#1c140c'
        },
        card: '#101613',
        border: '#212b25',
        danger: {
          DEFAULT: '#f2555a',
          foreground: '#2a0a0a'
        }
      },
      borderRadius: {
        lg: '0.7rem',
        xl: '0.9rem',
        '2xl': '1.1rem'
      },
      boxShadow: {
        soft: '0 20px 45px -32px rgba(0, 0, 0, 0.75)',
        lift: '0 26px 55px -28px rgba(47, 217, 122, 0.22)',
        glow: '0 0 0 1px rgba(47, 217, 122, 0.16), 0 18px 40px -22px rgba(47, 217, 122, 0.3)'
      }
    }
  }
};

export default config;
