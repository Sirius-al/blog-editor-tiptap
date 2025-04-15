/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './src/**/*.{mjs,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        solid: '#000000',
        foreground: "var(--foreground)",
        cadfGray: "var(--cadf-gray)",
        cadfPrimary: "var(--cadf-primary)",
        cadfSecondary: "var(--cadf-secondary)",
        cadfPrimaryHover: "var(--cadf-primary-hover)",
        cadfPrimaryHoverDark: "var(--cadf-primary-hover-dark)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
};
