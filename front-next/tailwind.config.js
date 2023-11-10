import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export const content = [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
]
export const safelist = [
  {
    pattern: /(bg|text)-(red|green|pink|purple|blue)-(50|100|200|300|400|500|600|700|800)/,
    variants: ['hover'],
  },
]
export const theme = {
  colors: {
    ...colors,
  },
  extend: {
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    },
  },
}
export const plugins = [require('@tailwindcss/forms'), require('@tailwindcss/forms')]
