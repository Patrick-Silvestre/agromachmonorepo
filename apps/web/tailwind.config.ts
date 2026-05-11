import type { Config } from 'tailwindcss';

import preset from '../../packages/config/tailwind/preset.ts';

const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/src/**/*.{ts,tsx}']
};

export default config;
